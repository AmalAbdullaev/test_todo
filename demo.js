var myList = document.getElementById("list");
var doneList = document.getElementById("donelist");

var todo = [];
var todone = [];

var temp;
var count = 0, countDone = 0, x = 0, y = 0;
var flag = true;

init()

function save_data(name, data, isJson) {
    var str = data;
    isJson ? str = JSON.stringify(str) : null;
    localStorage.setItem(name, str);
}

function get_data(name, isJson) {
    var data = localStorage.getItem(name);
    return isJson ? JSON.parse(data) || [] : data;
}

function save_count() {
    save_data("count", count, false);
    save_data("countDone", countDone, false);
}

function save_list() {
    save_data("todo", todo, true);
    save_data("todone", todone, true);
}

function get_count() {
    count = get_data("count", false);
    countDone = get_data("countDone", false);
}

function get_list() {
    todo = get_data("todo", true);
    todone = get_data("todone", true);
}

function init() {
    get_count();
    get_list();
    createList(count, 'todo');
    createList(countDone, 'todone');
}

function createList(count, name) {
    for (var c = 0; c < count; c++) {
        additem_todo(name);
    } 
}

function additem_whenenter(e) {
    if (e.keyCode === 13) {
        additem_todo('new');
    }
}

function additem_todo(flag) {
    var item = document.createElement("li");
    var span = document.createElement("span");
    var check = document.createElement("input");
    var spanimg = document.createElement("span");
    item.appendChild(check);

    item.appendChild(spanimg);
    item.appendChild(span);

    check.setAttribute('type', 'checkbox');
    check.classList.add("check-item");
    span.classList.add("list-item");
    spanimg.classList.add("glyphicon");
    spanimg.classList.add("glyphicon-remove");

    if (flag == 'todo') {
        var itemContent = todo[x];
        span.innerHTML = itemContent;
        myList.appendChild(item);
        x++;
        document.getElementById("noitem").style.display = "none";
    }
    else if (flag == 'todone') {
        check.checked = true;
        var itemContent = todone[y];
        span.innerHTML = itemContent;
        doneList.appendChild(item);
        y++;
        document.getElementById("doneitem").style.display = "none";
    }
    else {
        var itemContent = document.getElementById("itemname");
        todo.push(itemContent.value);
        save_list();
        span.innerHTML = itemContent.value;
        myList.appendChild(item);
        itemContent.value = "";
        count++;
        save_count();
        display_title();
    }


    check.addEventListener("change", function () {
        var doneItem = this.parentElement;
        temp = doneItem.childNodes[2].innerHTML;
        if (myList.id == this.parentElement.parentElement.id) {
            myList.removeChild(doneItem);
            span.innerHTML = temp;
            doneList.appendChild(item);
            count--;
            countDone++;
            todone.push(temp);
            todo = remove_item(temp, todo)
        }
        else {
            doneList.removeChild(doneItem);
            span.innerHTML = temp;
            myList.appendChild(item);
            count++;
            countDone--;
            todo.push(temp);
            todone = remove_item(temp, todone);
        }
        save_list();
        save_count();
        display_title();
    })

    spanimg.addEventListener("click", function () {

        var removeItem = this.parentElement;
        temp = removeItem.childNodes[2].innerHTML;

        if (myList.id == this.parentElement.parentElement.id) {
            myList.removeChild(removeItem);
            count--;
            todo = remove_item(temp, todo);
        }
        else {
            doneList.removeChild(removeItem);
            countDone--;
            todone = remove_item(temp, todone);
        }
        save_list();
        save_count();
        display_title();
    })

    span.addEventListener("dblclick", function () {
        var data = this.innerHTML;
        var parent = this.parentElement;
        span.innerHTML = "";
        var form = document.createElement("span");
        var text = document.createElement("input");
        var ok = document.createElement("button");
        var cancel = document.createElement("button");

        text.value = data;
        ok.innerHTML = "OK";
        cancel.innerHTML = "Cancel";

        form.appendChild(text);
        form.appendChild(ok);
        form.appendChild(cancel);
        span.appendChild(form);

        ok.addEventListener("click", function () {
            span.removeChild(form);
            todo = change_item(data, text.value, todo);
            todone = change_item(data, text.value, todone);
            console.log(todo)
            save_list();
            data = text.value;
            span.innerHTML = data;
            parent.appendChild(span);
        });

        cancel.addEventListener("click", function () {
            span.removeChild(form);
            span.innerHTML = data;
            parent.appendChild(span);
        });
    });
}

function change_item(data, value, array) {
    const index = array.indexOf(data);
    if (array[index]) {
        array[index] = value;
    }
    return array;
}

function remove_item(temp, array) {
    const index = array.indexOf(temp);
    if (index > -1) {
        array.splice(index, 1);
    }
    return array;
}

function display_title() {
    display_element("noitem", count);
    display_element("doneitem", countDone);
}

function display_element(elem, data) {
    var state = data > 0 ? "none" : "block";
    document.getElementById(elem).style.display = state;
}

function remove_list(id) {
    var root = document.getElementById(id);
    while (root.firstChild) {
        root.removeChild(document.getElementById(id).firstChild);
    }

    if (myList.id == id) {
        todo = [];
        count = 0;
    }
    else {
        todone = [];
        countDone = 0;
    }
    save_list();
    save_count();
    display_title();
}
