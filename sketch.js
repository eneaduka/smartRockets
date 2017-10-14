
var popu;
var lifespam=400;
var lifeP;
var target;
var count=0;

function setup(){

   createCanvas(600,400);
   //rocket = new Rocket;
   popu= new Population();
   lifeP=createP();
  target= createVector(width/2, 100);
  obsticle= createVector(width/2, 250);
}


function draw(){

  background(0);
  popu.run();
  lifeP.html(count)
  count++;
  if(count==lifespam){
    popu.evaluate();
    popu.selection();
    count=0;
  }
  ellipse(target.x,target.y,16,16);
  rect(260 ,250, 80 , 10);

}

function Rocket(dna){

  this.pos= createVector(width/2,height);
  this.vel= createVector();
  this.acc=createVector();
  this.fitness;
  this.reached=false;
  this.collision=false;
  if(dna){
    this.dna=dna;
  }else{
      this.dna= new DNA();
  }

  this.applyForce=function(force){
    this.acc.add(force);
  }

  this.calcfitness = function(){
      var d= dist(this.pos.x, this.pos.y, target.x,target.y);
      this.fitness= 1/d;
  }

  this.update = function(){
      this.applyForce(this.dna.genes[count]);

      var d = dist(this.pos.x, this.pos.y, target.x,target.y);
      if(d<16){
        this.reached=true;
        this.fitnes*=20;
      }


      if((this.pos.x > 260 && this.pos.x <340 && this.pos.y> 230 && this.pos.y < 260) || this.pos.x<0 || this.pos.x>width/0.99 || this.pos.y<0){
        this.collision=true;
        this.fitness =0;
      }
      if(!this.reached && !this.collision){
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }
  }

  this.show=function(col1, col2, col3){
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    rectMode(CENTER);
    fill(col1,col2,col3);
    rect(0,0,20,5);
    pop();
  }
  //this.maxFitness=function(){
    // fit = this.calcfitness();
     //if(fit>fitness);
     //fitness = fit;
  //}
}


function Population(){
  this.poprockets = [];
  this.popsize=40;
  this.matingpool = [];

  for(var i=0;i<this.popsize;i++){
    this.poprockets[i] = new Rocket;
  }

  this.evaluate = function() {
     var maxfit=0
      for(var i=0;i<this.popsize;i++){
        this.poprockets[i].calcfitness();
        if(this.poprockets[i].fitness>maxfit)
           maxfit=this.poprockets[i].fitness;
      }

      for(var i=0;i<this.popsize;i++){
          this.poprockets[i].fitness /= maxfit;
        }

      this.matingpool = [];

      for(var i=0;i<this.popsize;i++){
           var n = this.poprockets[i].fitness * 100;
           for(var j=0;j<n;j++){
             this.matingpool.push(this.poprockets[i]);
           }
        }

  }

  this.selection = function(){
      var newrockets = [];
      for(var i=0;i<this.poprockets.length;i++){
      var parenta= random(this.matingpool).dna;
      var parentb=random(this.matingpool).dna;
      var child= parenta.crosover(parentb);
      if(random(1)<0.2){
        newrockets[i] = new Rocket;
      }else{
      newrockets[i]= new Rocket(child);
       }
    }
    this.poprockets=newrockets;
  }

    this.run = function (){
      for(var i=0;i<this.popsize;i++){
        this.poprockets[i].update();
        this.poprockets[i].show(random(255),random(255),random(255));
      }
    }
}


function DNA(gene){


  if(gene){
    this.genes= gene;
  }
  else{
    this.genes = [];
  for(var i=0;i< lifespam;i++){
    this.genes[i] = p5.Vector.random2D();
    this.genes[i].setMag(0.15);
  }
}

  this.crosover = function(partner){
    var newdna = [];
    var mid=(random(this.genes.length));
    for(var i=0;i< this.genes.length;i++){
      if(i>mid)
         newdna[i]=(this.genes[i]);
      else
         newdna[i]=(partner.genes[i]);
    }
    return new DNA(newdna);
  }
}
