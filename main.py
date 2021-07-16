import uuid
from flask import Flask, render_template, request, redirect, send_file
from flask_mysqldb import MySQL
from flask import jsonify

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
imSavePath = "./"


app.config['MYSQL_HOST'] = "sql11.freesqldatabase.com"
app.config['MYSQL_USER'] = "sql11422669"
app.config['MYSQL_PASSWORD'] = "r5YLCCg1NC"
app.config['MYSQL_DB'] = "sql11422669"

mysql = MySQL(app)

@app.route('/')
def hello():
    return render_template("index.html")

@app.route('/get_events', methods=["GET", "POST"])
def get_events():
    if request.method == 'GET':
        cur = mysql.connection.cursor()
        events = cur.execute("SELECT * FROM events where start_date>CURRENT_DATE GROUP BY DATE(start_date)")
        eventsDetails=None
        if events > 0:
            eventsDetails = cur.fetchall()
        return jsonify(eventsDetails)

@app.route('/get_event/<int:id>', methods=["GET", "POST"])
def get_event(id):
    if request.method == 'GET':
        cur = mysql.connection.cursor()
        events = cur.execute("SELECT * FROM events where id_event=" + str(id))
        if events > 0:
            eventsDetails = cur.fetchall()
        print(jsonify(eventsDetails))
        return jsonify(eventsDetails)


@app.route('/submit', methods=["GET", "POST"])
def submit_ticket():
    if request.method == 'POST':
        login = request.form['login']
        password = request.form['password']
        event_id = request.form['id_event']

        cur = mysql.connection.cursor()
        user = cur.execute("SELECT * FROM users WHERE login='" + login + "'")
        if user > 0:
            userDetails = cur.fetchall()
            if userDetails[0][1] == password:
                ticket = cur.execute("SELECT * FROM tickets WHERE login='" + login + "' and id_event=" + event_id)
                if ticket == 0:
                    code = uuid.uuid4().hex
                    cur.execute("INSERT INTO tickets (login, id_event, code) VALUES (%s, %s, %s)",
                                (login, event_id, code))
                    mysql.connection.commit()
                    print(code)
                    return str(code)
                else:
                    return "1"
            else:
                return "0"
        else:
            cur.execute("INSERT INTO users (login, password) VALUES (%s, %s)", (login, password))
            code = uuid.uuid4().hex
            cur.execute("INSERT INTO tickets (login, id_event, code) VALUES (%s, %s, %s)", (login, event_id, code))
            mysql.connection.commit()
            print(code)
            return str(code)

@app.route('/event/<int:id>', methods=["GET", "POST"])
def render_event_page(id):
    cur = mysql.connection.cursor()
    events = cur.execute("SELECT * FROM events where id_event=" + str(id))
    if events > 0:
        return render_template("event_page.html", index=id)
    else:
        return render_template("event_page.html", index=0)


@app.route('/return', methods=["GET", "POST"])
def render_return_page():
    return render_template("return_page.html")


@app.route('/return_ticket', methods=["GET", "POST"])
def return_ticket():
    if request.method == 'POST':
        login = request.form['login']
        password = request.form['password']
        code = request.form['code']
        cur = mysql.connection.cursor()
        user = cur.execute("SELECT * FROM users WHERE login='" + login + "'")
        if user > 0:
            userDetails = cur.fetchall()
            if userDetails[0][1] == password:
                tickets = cur.execute("SELECT * FROM tickets WHERE login='"+login+"'")
                if tickets == 0:
                    return "You don't have any tickets"
                else:
                    ticket = cur.execute("SELECT e.title, e.id_event, e.start_date, e.end_date, t.code, t.login FROM tickets t inner join events e on e.id_event=t.id_event and DATEDIFF(e.start_date, CURRENT_DATE)>=2 and DATEDIFF(e.end_date, e.start_date)<=2 where login='" + login + "' and code='"+code+"'")
                    if ticket > 0:
                        cur.execute("DELETE FROM tickets WHERE code='"+code+"'")
                        mysql.connection.commit()
                        return "Ticket has been returned"
                    else:
                        ticket_from_code = cur.execute("SELECT * FROM tickets WHERE code='" + code + "'")
                        if ticket_from_code > 0:
                            return "You can't return ticket"
                        else:
                            return "Ticket not found"
            else:
                return "Invalid password"
        else:
            return "Can't find user"

if __name__ == '__main__':
    app.run(debug=True)
