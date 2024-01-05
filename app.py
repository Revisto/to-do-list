# to-do list flask app

import os
from flask import Flask,request,render_template
from datetime import date

#### Defining Flask App
app = Flask(__name__)


#### Saving Date today in 2 different formats
datetoday = date.today().strftime("%m_%d_%y")
datetoday2 = date.today().strftime("%d-%B-%Y")


#### If this file doesn't exist, create it
if 'tasks.txt' not in os.listdir('.'):
    with open('tasks.txt','w') as f:
        f.write('')


def gettasklist():
    with open('tasks.txt','r') as f:
        tasklist = f.readlines()
    return tasklist

def createnewtasklist():
    os.remove('tasks.txt')
    with open('tasks.txt','w') as f:
        f.write('')

def updatetasklist(tasklist):
    os.remove('tasks.txt')
    with open('tasks.txt','w') as f:
        f.writelines(tasklist)


################## ROUTING FUNCTIONS #########################

#### Our main page
@app.route('/')
def home():
    return render_template('home.html',datetoday2=datetoday2,tasklist=gettasklist(),l=len(gettasklist())) 


# Function to clear the to-do list
@app.route('/clear')
def clear_list():
    createnewtasklist()
    return render_template('home.html',datetoday2=datetoday2,tasklist=gettasklist(),l=len(gettasklist())) 

@app.route('/tasks')
def all_tasks():
    tasklist = gettasklist()
    for i in range(len(tasklist)):
        tasklist[i] = tasklist[i].replace('\n','')
    return tasklist

# Function to add a task to the to-do list
@app.route('/addtask',methods=['POST'])
def add_task():
    task = request.get_json()["newtask"]
    with open('tasks.txt','a') as f:
        f.writelines(task+'\n')
    return render_template('home.html',datetoday2=datetoday2,tasklist=gettasklist(),l=len(gettasklist())) 


# Function to remove a task from the to-do list
@app.route('/deltask',methods=['DELETE'])
def remove_task():
    task_content = request.args.get('task')
    tasklist = gettasklist()
    if task_content+'\n' in tasklist:
        removed_task = tasklist.remove(task_content+'\n')
    elif task_content in tasklist:
        removed_task = tasklist.remove(task_content)

    updatetasklist(tasklist)

    return render_template('home.html',datetoday2=datetoday2,tasklist=tasklist,l=len(tasklist)) 
    


#### Our main function which runs the Flask App
if __name__ == '__main__':
    app.run(debug=True)