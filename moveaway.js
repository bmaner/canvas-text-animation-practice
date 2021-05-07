const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let adjustX = 10;//particle 입자들의 위치를 이동시킬 수 있음
let adjustY = 10;//particle 입자들의 위치를 이동시킬 수 있음

let mouse = {
    x: null,
    y: null,
    radius: 150
}

window.addEventListener('mousemove',function(event){
    mouse.x = event.x;
    mouse.y = event.y;
})

ctx.fillStyle = 'white';
ctx.font = "90px Verdana";
ctx.fillText('A', 20, 60);
// const data = ctx.getImageData(0, 0, 100, 100);
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
    }
    draw(){
        ctx.fillStyle = 'white'
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy)
        //마우스에 멀리있는 입자가 마우스로 다가오게 하고(마우스의 끝쪽(150)에서 마우스의 중심점으로 움직이게 만들기 위함)
        //각자의 입자가 그것의 무게에 의해 다른 속도로 움직이게 하기 위한 셋팅 (constructor의 density 속성)
        //마우스의 중심에 가까우면 속도가 빠르게하고 끝쪽으로 갈 수록 느려지게 하기위한 세팅
        let forceDirectionX = dx / distance; 
        let forceDirectionY = dy / distance; 
        let maxDistance = mouse.radius; //이동속도가 0인 거리를 설정하기 위해 만듦
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density
        let directionY = forceDirectionY * force * this.density

        if(distance < mouse.radius){
            this.x -= directionX; 
            this.y -= directionY; 
        }else{//마우스로부터 일정 거리 이상 떨어졌을 시 다시 원래의 자리로 돌아가게 하는 부분
            if(this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/10; // /10을 하는 것은 천천히 돌아가게 하기 위하여
            }if(this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy/10; // /10을 하는 것은 천천히 돌아가게 하기 위하여
            }
        }
    }
}

function init(){
    particleArray = [];
    // for(let i = 0; i < 500; i++){
    //     let x = Math.random() * canvas.width;
    //     let y = Math.random() * canvas.height;
    //     particleArray.push(new Particle(x, y));
    // } 텍스트 Data를 불러오기위하여 주석 처리하였음.
    for(let y = 0, y2 = textCoordinates.height; y < y2; y++){
        for(let x = 0, x2 = textCoordinates.width; x < x2; x++){
            if(textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){ //불투명도가 특정값 이상인 fixel을 불러와 이를 새 위치에 확장하여 정렬
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(positionX * 10, positionY * 10))
            }
        }
    }
}

init();
console.log(particleArray);

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++){
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}

animate();

function connect(){
    for (let a = 0; a < particleArray.length; a++){
        for(let b = a; b < particleArray.length; b++){
            // let dx = mouse.x - this.x;
            // let dy = mouse.y - this.y;
            // let distance = Math.sqrt(dx * dx + dy * dy)
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if(distance < 30){
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}