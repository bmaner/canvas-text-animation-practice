// 첫번째 파트
//1. 무작위로 입자를 생성
//2. 그리고 캔버스에 뿌려서
//3. 물리를 구현(마찰, 가속, 각 입자에 다른 무게를 적용)

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = []; // 모든 파티클 오브젝트가 포함됨(크기, 색상, 좌표와 같은 정보를 포함함)

//마우스 상호작용을 처리하는 코드

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
// ctx.strokeStyle = 'white';
// ctx.strokeRect(0, 0, 100, 100);
const data = ctx.getImageData(0, 0, 100, 100); //위 영역에서 데이터를 불러온다.

class Particle {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x; //this.x와 this.y가 밀렸다가 다시 원래의 자리로 돌아가게 하기위하여 설정했음.
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
    update(){//입자와 마우스가 가까워지면 움직이게 하는 함수
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy) //피타고라스를 이용하여 점과 마우스 사이의 거리를 계산한다. 
        if(distance < 150){
            this.size = 15; //마우스와 점사이의 거리가 150미만이라면 점의 크기는 커지고
        }else{
            this.size = 3; // 마우스와 점사이의 거리가 150이상이라면 점의 크기는 원래로 돌아간다.
        }
    }
}

function init(){ // 위에서 만든 particle 클래스를 무작위로 생성하기 위하여 만든 임의의 함수. particle 클래스를 여러번 호출하고 이를 particleArray에 넣는다.
    particleArray = [];
    for(let i = 0; i < 500; i++){
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particleArray.push(new Particle(x, y));
    }
}

init();
console.log(particleArray);

function animate(){ //캔버스를 지웠다가 다시 그려주는 기능을 하는 함수(재귀의 형태를 띈다.)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++){
        particleArray[i].draw();
        particleArray[i].update();
    }
    requestAnimationFrame(animate);
}

animate();