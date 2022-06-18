function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

class Node {
    constructor(question, options=[], selectedOptions=[]) {
        this.id = generateUUID();
        this.question = question;
        this.options = options;
        this.selectedOptions = selectedOptions;
        this.min = 1;
        this.max = 4;
        this.currentPriority = 0;
        this.returnNode = null;
    }
}

class Graph {
    constructor() {
      this.adList = new Map();
    }
    addVertex(vertex) {
      if (!this.adList.get(vertex)) {
        this.adList.set(vertex, []);
      }
    }
    addEdge(source, destination, condition=true, priority=0) {
      if (!this.adList.get(source)) {
        this.addVertex(source);
      }
      if (!this.adList.get(destination)) {
        this.addVertex(destination);
      }
      this.adList.get(source).push({node:destination, condition, priority});
    }
    removeEdge(source, destination) {
      this.adList.set(source, this.adList.get(source).filter(vertex => vertex.node !== destination));
    }
    removeVertex(vertex) {
      while (this.adList.get(vertex)) {
        const adjacentVertex = this.adList.get(vertex).pop();
        this.removeEdge(vertex, adjacentVertex.node);
      }
      this.adList.delete(vertex);
    }  
}


var g =  new Graph();
var q1 = new Node("q1", ["a", "b", "c", "d"]);
var qa1 = new Node("qa1", ["a", "b", "c", "d"]);
var qb1 = new Node("qb1", ["a", "b", "c", "d"]);
var qc1 = new Node("qc1", ["a", "b", "c", "d"]);
var qd1 = new Node("qd1", ["a", "b", "c", "d"]);
var q2 = new Node("q2", ["p", "q"]);
var q3 = new Node("q3", ["o", "b", "j", "t"]);
var q4 = new Node("q4", ["e", "f", "g", "h"]);
var q9 = new Node("q9", ["e", "f", "g", "h"]);
var q5 = new Node("end");

g.addVertex(q1);
g.addVertex(qa1);
g.addVertex(qb1);   
g.addVertex(qc1);
g.addVertex(qd1);
g.addVertex(q2);
g.addVertex(q3);
g.addVertex(q4);

g.addEdge(q1, q2, "!q1.d", 0);
g.addEdge(q1, qa1, "q1.a", 1);
g.addEdge(q1, qb1, "q1.b", 2);
g.addEdge(q1, qc1, "q1.c", 3);
g.addEdge(q1, qd1, "q1.d", 4);
g.addEdge(q1, q4, "true", );
g.addEdge(q2, q1, "!q2.p", 0);
g.addEdge(q2, q9, "q2.p", 1);
g.addEdge(q3, q4, "true", 0);
g.addEdge(q4, q5, "true", 0);



(function(){
    let str = '';
    g.adList.forEach(function(_, node){
        let opts = node.options.map((opt) => `<input data-node="${node.id}" type="button" class="opt" value="${opt}" />`).join("");
        str += `<div class="level hide" id="section-${node.question}">
            <div class="question">${node.question}</div>
            <div class="options">${opts}</div>
            <div><button data-node="${node.id}" class="continue">Continue</button></div>
        </div>`;
    })

    document.querySelector("#container").innerHTML = str;

    document.querySelector("#container").addEventListener('click', e => handleSelection(e));

    document.querySelector("#section-q1").classList.remove("hide");
})();


var registry = [];
var nodeRegistry = new Set();

function handleSelection(e) {
    const element = e.target;
    if (element.matches('button')) {
        handleContinue(element);
    } else {
        addToSelection(element);
    }
}

function addToSelection(element) {
    let currentNode = findNode(element.dataset.node);
    if(currentNode) {
        registry.push(`${currentNode.question}.${element.value}`);
        nodeRegistry.add(currentNode);
        currentNode.selectedOptions.push(`${currentNode.question}.${element.value}`);
    }
}

function handleContinue(element) {
    let currentNode = findNode(element.dataset.node);
    let edges = g.adList.get(currentNode);
    let node = findNextNode(currentNode, edges);
    if(typeof node === "undefined") {
        if(currentNode.options.length === 0) {
            alert("done");
            return;
        } else {
            node = currentNode.returnNode;
        }
    }

    // check if node is already visited.
    // if not show the node
    // else check priority for next node;
    while(node) {
        if(node.options.length === 0) {
            alert("done");
            return;
        }
        if(!nodeRegistry.has(node)) {
            hideNode(currentNode);
            showNode(node);
            nodeRegistry.add(node);
            node.returnNode = currentNode;
            currentNode = node;
            break;
        } else {
            let nextNode = findNextNode(node, g.adList.get(node));
            if(typeof nextNode ==="undefined") {
                node = node.returnNode;
            } else {
                node = nextNode;
            }
        }
    }
    // check current Selection
    // pick the path -> check current selection
    // pick current priority
}

function hideNode(node) {
    document.querySelector(`#section-${node.question}`).classList.add("hide");
}

function showNode(node) {
    document.querySelector(`#section-${node.question}`).classList.remove("hide");
}

function findNextNode(currentNode, edges) {
    // console.log(currentNode);
    // console.log(edges);
    let x = currentNode.currentPriority;
    let maxPriority = Math.max(...edges.map(edge => edge.priority));
    while(x <= maxPriority) {
        console.log("----", x, '-------', currentNode.currentPriority);
        let cEdge = edges.find((edge) => edge.priority === x);
        if(typeof cEdge === "undefined") {
            x++;
        } else {
            // validate the path
            // currentNode
            let selectionOptions = currentNode.selectedOptions;
            let condition = cEdge.condition;
            //if true, selection
            if(isValidPath(condition, selectionOptions)) {
                currentNode.currentPriority = x+1; 
                return cEdge.node;
            } else {
                x++;
            }
        }
    }
    currentNode.currentPriority = x; 
}

function findNode(id) {
    let currentNode = null;
    g.adList.forEach(function(_, node){
        if(node.id === id) {
            currentNode = node;
        }
    });
    return currentNode;
}

function isValidPath(str, arr) {
    if(str==="true") {
        return true;
    }
    if(str==="false") {
        return false;
    }
    var start = 0;
    var end = 0;
    var not = false;
    var i = 0;
    var estring = "";
    while(i < str.length) {
        if(str[i] === "!") {
            not = !not;
            i++;
            start = start+1;
            if(end < start) {
                end = start;
            }
            continue;
        }

        if(str[i] === "(" || str[i] === ")") {
            let token = str.substring(start, end+1);
            let ex = arr.includes(token);
            if(not) {
                ex = `!${ex}`;
                not = !not;
            }
            estring += ex;

            i++;
            start = i;
            estring += str[i];
            start = start+1;
            if(end < start) {
                end = start;
            }
            continue;
        }

        if(str[i] === "|" || str[i] === "&") {
            let token = str.substring(start, end);
            let ex = arr.includes(token);;
            if(not) {
                ex = `!${ex}`;
                not = !not;
            }
            estring += ex;
            if(str[i] === "|") {
                estring += "||";
            }
            if(str[i] === "&") {
                estring += "&&";
            }
            i = i+2;
            start = i;
            end = i;
            continue;
        }
        end++;

        i++;
    }

    let token = str.substring(start, end+1);
    let ex = arr.includes(token);
    if(not) {
        ex = `!${ex}`;
        not = !not;
    }
    estring += ex;

    console.log(str);
    console.log(arr);
    console.log(estring);
    return eval(estring);
}
