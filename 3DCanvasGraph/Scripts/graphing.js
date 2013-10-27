function Graph(xtitle, ytitle, ztitle){
              
	//Initialise Graph  		
	var xtitle=xtitle;		  
	var ytitle = ytitle;
	var ztitle = ztitle;
	var findBiggest = function (elements) {
	    var xlim = 0;
	    var ylim = 0;
	    var zlim = 0;
	    for (var i = 0; i < elements.length; i++) {
	        if (Number(elements[i][xtitle]) > xlim) {
	            xlim = Number(elements[i][xtitle]);
	        }
	        if (Number(elements[i][ytitle]) > ylim) {
	            ylim = Number(elements[i][ytitle]);
	        }
	        if (Number(elements[i][ztitle]) > zlim) {
	            zlim = Number(elements[i][ztitle]);
	        }
	    }
	    return new Array(xlim * 1.1, ylim * 1.1, zlim * 1.1);
	}
	var findSmallest = function (elements) {
	    var xlim=99999999;
	    var ylim=99999999;
	    var zlim=99999999;
	    if(elements.length>1){
	        for(var i=0; i<elements.length;i++){
	            if(Number(elements[i][xtitle])<xlim){xlim=Number(elements[i][xtitle]);}
	            if(Number(elements[i][ytitle])<ylim){
	                ylim=Number(elements[i][ytitle]);
	            }
	            if(Number(elements[i][ztitle])<zlim){zlim=Number(elements[i][ztitle]);}
	        }
	        return new Array(xlim*0.9, ylim*0.9, zlim*.9);
	    }
	    else return new Array(0.0,0.0,0.0);
	}
	return {
	    drawGraph: function (elements) {
	        var lims = findBiggest(elements);
	        var lowLims = findSmallest(elements);
	        console.log(lims)
	        console.log(lowLims)
	        this.g = new canvasGraph('graph', lims[0].toFixed(2), lims[1].toFixed(2), lims[2].toFixed(2), xtitle, ytitle, ztitle, lowLims[0].toFixed(2), lowLims[1].toFixed(2), lowLims[2].toFixed(2));

	        var gData=new Array();
            for(var i=0; i<elements.length;i++){
                gData[gData.length]={x:elements[i][xtitle],y:elements[i][ytitle],z:elements[i][ztitle], title:elements[i]["title"]};
            }
            // sort data - draw farest elements first         
            gData.sort(sortNumByZ);  
                          
           //draw graph   
            this.g.drawGraph(gData);  
	    }
	}
}
