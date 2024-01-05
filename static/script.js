// IEFE
(() => { 
  // state variables
  let toDoListArray = [];

  async function fetchData() {
    try {
      const response = await fetch('/tasks');
      const data = await response.json();
      console.log(data);

      // Loop through data and print each item
      data.forEach(toDoItem => {
        itemId = String(Date.now());
        addItemToDOM(itemId , toDoItem);
        addItemToArray(itemId, toDoItem);
      });

      // Continue with your code here
    } catch (error) {
      console.error('Error:', error);
    }
  }

  fetchData();
  console.log(toDoListArray);
  // ui variables
  const form = document.querySelector(".form"); 
  const input = form.querySelector(".form__input");
  const ul = document.querySelector(".toDoList"); 

  // event listeners
  form.addEventListener('submit', e => {
    // prevent default behaviour - Page reload
    e.preventDefault();
    // give item a unique ID
    let itemId = String(Date.now());
    // get/assign input value
    let toDoItem = input.value;
    //pass ID and item into functions
    addToDB(itemId, toDoItem);
    addItemToDOM(itemId , toDoItem);
    addItemToArray(itemId, toDoItem);
    // clear the input box. (this is default behaviour but we got rid of that)
    input.value = '';
  });
  
  ul.addEventListener('click', e => {
    let id = e.target.getAttribute('data-id')
    if (!id) return // user clicked in something else      
    //pass id through to functions
    removeItemFromDOM(id);
    removeItemFromArray(id);
  });
  
  // functions 
  function addItemToDOM(itemId, toDoItem) {    
    // create an li
    const li = document.createElement('li')
    li.setAttribute("data-id", itemId);
    // add toDoItem text to li
    li.innerText = toDoItem
    // add li to the DOM
    ul.appendChild(li);
  }
  
  function addToDB(itemId, toDoItem) {
    fetch('/addtask', {
      method: 'POST',
      body: JSON.stringify({ newtask: toDoItem }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  function addItemToArray(itemId, toDoItem) {
    // add item to array as an object with an ID so we can find and delete it later
    toDoListArray.push({ itemId, toDoItem});
    console.log(toDoListArray);
    // send task as newtask parameter to /addtask using POST method

    console.log(toDoListArray);

    // add item to array as an object with an ID so we can find and delete it later
    toDoListArray.push({ itemId, toDoItem});
    console.log(toDoListArray)
  }
  
  function removeItemFromDOM(id) {
    // get the list item by data ID
    var li = document.querySelector('[data-id="' + id + '"]');
    // remove list item
    var liContent = li.innerText;
    ul.removeChild(li);

    fetch('/deltask?task=' + liContent, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

  }
  
  function removeItemFromArray(id) {
    // create a new toDoListArray with all li's that don't match the ID
    toDoListArray = toDoListArray.filter(item => item.itemId !== id);
    console.log(toDoListArray);
  }
  
})();