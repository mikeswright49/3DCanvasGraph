// VERSION 0.5 beta
// 
// This software is published under BSD licence.
//##############################################################################
//* Copyright (c) 2007, Bajcic Dragan [dragan.bajcic|at|gmail|dot|com]
//* All rights reserved.
//* Redistribution and use in source and binary forms, with or without
//* modification, are permitted provided that the following conditions are met:
//*
//*     * Redistributions of source code must retain the above copyright
//*       notice, this list of conditions and the following disclaimer.
//*     * Redistributions in binary form must reproduce the above copyright
//*       notice, this list of conditions and the following disclaimer in the
//*       documentation and/or other materials provided with the distribution.
//*     * Neither the name of the University of California, Berkeley nor the
//*       names of its contributors may be used to endorse or promote products
//*       derived from this software without specific prior written permission.
//*
//* THIS SOFTWARE IS PROVIDED BY COPYRIGHT HOLDERS ``AS IS'' AND ANY
//* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
//* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
//* DISCLAIMED. IN NO EVENT SHALL THE REGENTS AND CONTRIBUTORS BE LIABLE FOR ANY
//* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
//* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
//* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
//* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
//* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
//* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//* 
//##############################################################################

canvasGraph=function(elm,xMax,yMax,zMax, xLabel, yLabel, zLabel,xMin,yMin,zMin){
	// initialise
	var canvas= document.getElementById(elm);
    this.ctx = canvas.getContext('2d');
    
	this.ctx.clearRect(0,0,600,600);
	//define some constants
	this.containerWidth=600; 	//default
	this.containerHeight=600;	//default  
	this.padding=10;
	this.xMid=this.containerWidth/2;
	this.yMid=this.containerHeight/2;
	
	this.startX=this.xMid-60;
	this.startY=this.yMid+60;
	this.gray1="#c1c1c1";
	this.gray2="#f1f1f1	";
	this.gray3="#787878";
	this.stepX=this.xMid/10;
	this.stepY=this.yMid/10;
	
	// min - max range, defalut value
	
	this.xMin=xMin;
	this.xMax=xMax;
	this.yMin=yMin;
	this.yMax=yMax;
	this.zMin=zMin;
	this.zMax=zMax;

	this.factor=(this.stepX / 1.5);
	this.perspectiveFactor = 1.2;
	
	this.xLabel=xLabel;
	this.yLabel=yLabel;
	this.zLabel=zLabel;
	
	this.ignore=new Array();
	this.colours=new Array();
	// Draw XYZ AXIS 
	this.drawAxis();
	this.drawInfo();
}


canvasGraph.prototype.drawAxis=function(){

	this.ctx.fillStyle = this.gray1;
	this.ctx.strokeStyle= this.gray1;
	
	//draw Z-axis
	this.ctx.beginPath();
	this.ctx.moveTo((this.startX),(this.startY));
	this.ctx.lineTo(this.padding,this.containerHeight-this.padding);
	this.ctx.stroke();
	this.ctx.closePath();
	//draw Y-axis	
	this.ctx.fillRect(this.startX,this.padding,1,(this.startY-this.padding));
	//draw X-axis
	this.ctx.fillRect(this.startX,this.startY,(this.startY-this.padding),1);
	
	
	this.yHeight = this.startY - (2 * this.stepX);
	
	sx=this.startX;
	markH=this.containerHeight/100;
	sy=this.startY;
	this.ctx.strokeStyle=this.ctx.fillStyle = this.gray3;
    xx=sx
    yy=sy;
    
	var perspectiveCompensation = 0;
    this.marginX=this.padding + this.startY - (10*this.stepX) - (this.padding);	
	for(i=0;i<10;i++){

		sx=sx+this.stepX;
		sy=sy-(this.stepX);
		
		xx=xx-this.factor;
		yy=yy+this.factor;
		perspectiveCompensation = i * this.factor * this.perspectiveFactor + (this.perspectiveFactor * this.factor - i);
		this.ctx.strokeStyle=this.ctx.fillStyle = "rgba(200,200,200,0.5)";
        
        // Draw XY Grid lines		
		this.ctx.fillRect(sx ,this.marginX,1,this.startY - this.marginX);
		this.ctx.fillRect(this.startX,sy, this.startY - this.marginX,1);
		
		// Draw XZ Grid lines
		
		this.ctx.fillRect(xx,yy, this.startY - this.marginX + perspectiveCompensation,1);
		
		this.ctx.beginPath();
		this.ctx.moveTo(sx,this.startY);
		this.ctx.lineTo(sx - ((10 * this.factor) - perspectiveCompensation) ,this.startY+((10)*this.factor));
		this.ctx.stroke();
		
		//Draw YZ Grid Lines
		this.ctx.fillRect(xx  ,yy,1, (-1 * this.yHeight - perspectiveCompensation) )
	    
		this.ctx.beginPath();
		this.ctx.moveTo(this.startX,sy);
		this.ctx.lineTo(this.startX-(10*this.factor) ,sy + (10 * this.factor) - perspectiveCompensation);
		this.ctx.stroke();
		
		//Draw mark on Axis
		this.ctx.strokeStyle=this.ctx.fillStyle = this.gray3;	

		this.ctx.fillRect(sx,this.startY-(markH/2),1,markH);
		this.ctx.fillRect(this.startX-(markH/2),sy,markH,1);

		this.ctx.beginPath();
		this.ctx.moveTo(xx-(markH/2),yy-(markH/2));
		this.ctx.lineTo(xx,yy);
		this.ctx.stroke();
		
	     
	}
	
	

}
canvasGraph.prototype.drawBar=function(x,y,z,r,g,b){
  
	x_min=this.xMin;
	x_max=this.xMax;

	y_min=this.yMin;
	y_max=this.yMax;
	
	z_min=this.zMin;
	z_max=this.zMax;
	
	graph_step_x=(x_max-x_min)/10;
	graph_step_y=(y_max-y_min)/10;
	graph_step_z=(z_max-z_min)/10;
	
	var pcyz = (((y-y_min)/y_max*10) * this.factor * this.perspectiveFactor - ((y-y_min)/y_max*(10/this.perspectiveFactor)) * this.perspectiveFactor) * ((z-z_min)/z_max*1) ;
	var pcx = (((x-x_min)/x_max*10) * this.factor * this.perspectiveFactor  - ((x-x_min)/x_max*(10/this.perspectiveFactor)) * this.perspectiveFactor) * ((z-z_min)/z_max *1) 


		
	y_height_scaled=((y-y_min) * this.stepY/graph_step_y) + pcyz;
	x_width_scaled=((x-x_min) * this.stepX/graph_step_x) + pcx;
	z_len_scaled=((z-z_min) * this.factor/graph_step_z);
	
	x_scaled=this.startX + x_width_scaled ;
	y_scaled=this.startY - y_height_scaled;
	
	//x_3d and y_3d are 2D representation of any  3D XYZ Coordinates within given range (xyz max - min )
	x_3d=x_scaled-z_len_scaled;
	y_3d=y_scaled+z_len_scaled;
	
	//white cap on top
	this.ctx.fillStyle=this.ctx.strokeStyle = "rgba(255,255,255,1)";
	this.ctx.beginPath();
	this.ctx.moveTo(x_3d - 3,y_3d);
	this.ctx.lineTo(x_3d + 3,y_3d);
	this.ctx.lineTo(x_3d + 7,(y_3d - 3));
	this.ctx.lineTo(x_3d ,(y_3d-3));
	this.ctx.lineTo(x_3d -2 ,y_3d);
	this.ctx.closePath();
	this.ctx.fill();
	
	//main color
	this.ctx.fillStyle = "rgba("+r+","+g+","+b+",0.7)";
	this.ctx.fillRect(x_3d-3,y_3d,7,y_height_scaled);
	
	//shadow	
	this.ctx.fillStyle =  "rgba("+(r*.75).toFixed(0)+","+(g*.75).toFixed(0)+","+(b*.75).toFixed(0)+",0.7)";
	this.ctx.fillRect(x_3d+4,y_3d-0,1,y_height_scaled);
	this.ctx.fillRect(x_3d+5,y_3d-1,1,y_height_scaled);
	this.ctx.fillRect(x_3d+6,y_3d-2,1,y_height_scaled);
	this.ctx.fillRect(x_3d+7,y_3d-3,1,y_height_scaled);
	
	//black outline 
	
	this.ctx.fillStyle = "rgba(0,0,0,0.7)";
	this.ctx.fillRect(x_3d-3,y_3d,1,y_height_scaled);
	this.ctx.fillRect(x_3d+7,y_3d-3,1,y_height_scaled);
	this.ctx.fillRect(x_3d-2,(y_3d+y_height_scaled),7,1);
	this.ctx.fillRect(x_3d-3,(y_3d-1),1,1);
	this.ctx.fillRect(x_3d-2,(y_3d-2),1,1);
	this.ctx.fillRect(x_3d-1,(y_3d-3),1,1);
	this.ctx.fillRect(x_3d+5,(y_3d-1+y_height_scaled),1,1);
	this.ctx.fillRect(x_3d+6,(y_3d-2+y_height_scaled),1,1);
	this.ctx.fillRect(x_3d+7,(y_3d-3+y_height_scaled),1,1);
	this.ctx.fillRect(x_3d,(y_3d-3),7,1);
	
	

}
canvasGraph.prototype.drawGraph=function(gData, single){
	if(single==undefined)this.data=gData;
	this.ctx.clearRect(0,0,600,600);
	this.drawAxis();
	this.drawInfo();
	for(i=0;i<gData.length;i++){
		//dbgEl.innerHTML+='x: '+gData[i].x+' y:'+gData[i].y+' z:'+gData[i].z+' <br />';
		if(single!=undefined&&single==gData[i].title){
			if(!this.colours[gData[i].title]){
				this.colours[gData[i].title]={r:(Math.random()*255).toFixed(0), g:(Math.random()*255).toFixed(0),b:(Math.random()*255).toFixed(0)};
				this.drawBar(gData[i].x,gData[i].y,gData[i].z,this.colours[gData[i].title].r,this.colours[gData[i].title].g,this.colours[gData[i].title].b); 
			}
			else{
				this.drawBar(gData[i].x,gData[i].y,gData[i].z,this.colours[gData[i].title].r,this.colours[gData[i].title].g,this.colours[gData[i].title].b); 
			}
		}
		else if(single==undefined&&!this.ignore[gData[i].title]){
			if(!this.colours[gData[i].title]){
				this.colours[gData[i].title]={r:(Math.random()*255).toFixed(0), g:(Math.random()*255).toFixed(0),b:(Math.random()*255).toFixed(0)};
				this.drawBar(gData[i].x,gData[i].y,gData[i].z,this.colours[gData[i].title].r,this.colours[gData[i].title].g,this.colours[gData[i].title].b); 
			}
			else{
				this.drawBar(gData[i].x,gData[i].y,gData[i].z,this.colours[gData[i].title].r,this.colours[gData[i].title].g,this.colours[gData[i].title].b); 
			}
		}
	}
	this.drawLegend(this.colours);
}

canvasGraph.prototype.drawInfo=function(){

	this.infoElm=document.getElementById('gInfo');
	
	this.infoElm.innerHTML='<div id="y-label">'+this.yLabel+'</div>';
	this.infoElm.innerHTML+='<div id="x-label">'+this.xLabel+'</div>';
	this.infoElm.innerHTML+='<div id="z-label">'+this.zLabel+'</div>';
	
	this.infoElm.innerHTML+='<div id="t-001" class="gText">'+this.xMin+'</div>';
	this.infoElm.innerHTML+='<div id="t-005" class="gText">'+this.yMin+'</div>';
	this.infoElm.innerHTML+='<div id="t-006" class="gText">'+this.zMin+'</div>';
	
	//y
	this.infoElm.innerHTML+='<div id="t-002" class="gText">'+this.yMax+'</div>';
	//x
	this.infoElm.innerHTML+='<div id="t-003" class="gText">'+this.xMax+'</div>';
	//z
	this.infoElm.innerHTML+='<div id="t-004" class="gText">'+this.zMax+'</div>';
	
		

	
	this.infoElm=document.getElementById('t-002').style.top='54px';
	this.infoElm=document.getElementById('t-002').style.left='210px';
	
	this.infoElm=document.getElementById('t-003').style.top='370px';
	this.infoElm=document.getElementById('t-003').style.left='530px';

	this.infoElm=document.getElementById('t-004').style.top='555px';
	this.infoElm=document.getElementById('t-004').style.left='40px';
	
	//x
	this.infoElm=document.getElementById('t-001').style.top='350px';
	this.infoElm=document.getElementById('t-001').style.left='210px';
	
	//y
	this.infoElm=document.getElementById('t-005').style.top='370px';
	this.infoElm=document.getElementById('t-005').style.left='230px';
	
	//z
	this.infoElm=document.getElementById('t-006').style.top='340px';
	this.infoElm=document.getElementById('t-006').style.left='243px';
	this.drawAxisLabels("x", this.xMin, this.xMax);
	this.drawAxisLabels("y", this.yMin, this.yMax);
	this.drawAxisLabels("z", this.zMin, this.zMax);
}
canvasGraph.prototype.drawLegend=function(alloys){
	var legend=document.getElementById('legend');
	for(var x=legend.childNodes.length-1; x>-1; x--){
		legend.removeChild(legend.childNodes[x]);
	}
	var table=document.createElement('table');
	table.id="legendTable";
	legend.appendChild(table);
	for(var i in alloys){
		if(!this.ignore[i]){
			var row = $('<tr title="'+this.getTipText(i)+'"><td id="'+i+'" style="width:2x;height:0px;border:5px solid rgb('+alloys[i].r+','+alloys[i].g+','+alloys[i].b+')"></td><td>'+i+'</td><td><input type="checkbox" id="check'+i+'" checked/></td></tr>');			row.appendTo(table);
			var check=document.getElementById('check'+i);
			check.obj=this;
			check.onclick=function(){this.obj.redraw(this);}
			row=document.getElementById(i);
			row.obj=this;
			row.onmouseover=function(){
				this.obj.drawGraph(this.obj.data, this.id);
			}
			row.onmouseout=function(){
				this.obj.drawGraph(this.obj.data);
			}
		}
	}
	var row = $('<tr><td></td><td><input type="button" id="showAll" value="Show All"/></td><td></td></tr>');
	row.appendTo(table);
	var check=document.getElementById('showAll');
	check.obj=this;
	check.onclick=function(){this.obj.ignore=new Array(); this.obj.drawGraph(this.obj.data);}
}
canvasGraph.prototype.getTipText=function(title){
	var string="";
	for(var i in this.data){
		if(this.data[i].title==title){
			string=string+" "+this.xLabel+":"+this.data[i].x+" "+this.yLabel+":"+this.data[i].y+" "+this.zLabel+":"+this.data[i].z+'\n';
		}
	}
	return string;
}	
canvasGraph.prototype.redraw=function(box){
	if(box.checked==true)return;
	else{
		var string=box.id.substring("check".length);
		this.ignore[string]=1;
		this.drawGraph(this.data);
	}
}
canvasGraph.prototype.drawAxisLabels=function(axis, min, max){
	if(axis=="x"){
		var gContainer=document.getElementById("gInfo");
		var step=((max-min)/10).toFixed(2);

		for(var i=1; i<10; i++){
			if(min!=0)var text=Number((step*i))+Number(min);
			else text=Number(step*i);
			gContainer.innerHTML+='<div id="x-00'+i+'" class="gText">'+Number(text).toFixed(2)+'</div>';
			var label=document.getElementById('x-00'+i);
			if(i%2==1)label.style.top='350px';
			else label.style.top='370px';
			label.style.left=230+i*30+'px';
		}
	}
	else if(axis=="y"){
		var gContainer=document.getElementById("gInfo");
		var step=((max-min)/10);
		for(var i=1; i<10; i++){
			if(min!=0)var text=Number((step*i))+Number(min);
			else text=Number(step*i);
			gContainer.innerHTML+='<div id="y-00'+i+'" class="gText">'+Number(text).toFixed(2)+'</div>';
			var label=document.getElementById('y-00'+i);
			if(i%2==0)label.style.left='210px';
			else label.style.left='255px';
			label.style.top=358-i*30+'px';
		}
	}
	else if(axis=="z"){
		var gContainer=document.getElementById("gInfo");
		var step=((max-min)/10);
		for(var i=1; i<10; i++){
			if(min!=0)var text=Number((step*i))+Number(min);
			else text=Number(step*i);
			gContainer.innerHTML+='<div id="z-00'+i+'" class="gText">'+Number(text).toFixed(2)+'</div>';
			var label=document.getElementById('z-00'+i);
			var offset=i*7*2.6;
			if(i==1)label.style.left='197px';
			else if(i%2==1)label.style.left=197-offset+'px';
			else label.style.left=235-offset+'px';
			label.style.top=358+i*10*1.9+'px';
		}

	}
}

//edit this if you use some other range of numbers
function checkRange(param,min,max){
	if(param>=min && param <= max ){
	
	return true;
	
    }else{
		alert('Invalid value: '+param );
    }	

}

//helper function 
function sortNumByZ(a, b) {
    var x = a.z;
    var y = b.z;
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}
