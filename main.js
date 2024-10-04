'use strict';

const mp_x = document.getElementById('mp_x');
const mp_y = document.getElementById('mp_y');
const anzahl = document.getElementById('anzahl');
const winkel = document.getElementById('winkel');
const kante = document.getElementById('kante');
const breite = document.getElementById('breite');
const radius = document.getElementById('radius');
const h = document.getElementById('h');
const output_json = document.getElementById('json');
const canvas = document.getElementById('skizze');
const ctx = canvas.getContext("2d");
const button = document.querySelector('input[type="button"]');
button.addEventListener("click", Klick);

let startVector;
let b;

function Sin(zahl) { return Math.sin(zahl * (Math.PI / 180)); }
function Cos(zahl) { return Math.cos(zahl * (Math.PI / 180)); }
function Round8(zahl) { 
    let z = Math.round(zahl*100000000);
    return z/100000000;
};

class Vector2 {
    constructor(x, y) {
        this.x = x !== undefined ? Round8(x) : 0;
        this.y = y !== undefined ? Round8(y) : 0;
    }

    Clone(){
        return new Vector2(this.x, this.y);
    }

    Rotate(grad){
        let sin = Sin(grad);
        let cos = Cos(grad);
        let x = (this.x * cos) - (this.y * sin);
        let y = (this.x * sin) + (this.y * cos);
        this.x = x;
        this.y = y;
        return this;
    }

    Offset(vector){
        this.x = this.x - -vector.x;
        this.y = this.y - -vector.y;
        return this;
    }

    ToString(){
        return "{" + this.x + " : " + this.y + "}";
    }
    // ToString(){
    //     return this.x + ":" + this.y;
    // }
}

function Klick() {
    if (button.id === "berechnen") {
        winkel.value = 360 / anzahl.value;
        let beta = (180 - winkel.value) / 2;
        b = kante.value / (Cos(beta) * 2);
        h.value = b * Sin(beta);
        radius.value = h.value - (breite.value / 2);
        let b_back = radius.value / Sin(beta);
        startVector = new Vector2(kante.value / 2, h.value);
        //startVector = new Vector2(0, -b + (breite.value / 2));
        //startVector.Rotate(-winkel.value/2);
        let vector = new Vector2(0, radius.value);
        //vector.Rotate(winkel.value/2);
        let offset = new Vector2(mp_x.value, mp_y.value);
        let points = 'Position: {x:y}\n';
        for (let i = 0; i < anzahl.value; i++) {
            points = points + '\n' + i + ': ' + vector.Clone().Offset(offset).ToString();
            vector.Rotate(winkel.value);
        }
        output(points);
        //var obj = {a:1, 'b':'foo', c:[false,'false',null, 'null', {d:{e:1.3e5,f:'1.3e5'}}]};
        var obj = {a:1, 'b':'foo', c:[false,'false',null, 'null', {d:{e:1.3e5,f:'1.3e5'}}]};
        var str = JSON.stringify(obj, undefined, 2);
        //output(str);
        Draw();
    }
}

function Draw() {
    ctx.reset();
    let scale = canvas.width/2.2/b;
    ctx.scale(scale, scale);
    //ctx.translate((canvas.width/2)/scale-mp_x.value, (canvas.height/2)/scale-mp_y.value);
    ctx.translate((canvas.width/2)/scale, (canvas.height/2)/scale);
    ctx.lineJoin = "miter"
    //ctx.rotate(90 * Math.PI/180);
    ctx.strokeStyle = '#00f';
    ctx.lineWidth = breite.value/2;
    ctx.beginPath();
    ctx.moveTo(startVector.x, startVector.y);
    for (let i = 0; i < anzahl.value-1; i++) {
        startVector.Rotate(winkel.value);
        ctx.lineTo(startVector.x, startVector.y);
    }
    ctx.closePath();
    ctx.stroke();
    //Radius
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 1/scale;
    startVector.Rotate(winkel.value);
    ctx.beginPath();
    ctx.moveTo(startVector.x, startVector.y);
    for (let i = 0; i < anzahl.value-1; i++) {
        startVector.Rotate(winkel.value);
        ctx.lineTo(startVector.x, startVector.y);
    }
    ctx.closePath();
    ctx.stroke();
    //Radius Line
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -h.value);
    ctx.stroke();
}

function output(inp) {
    output_json.innerHTML = inp;
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
