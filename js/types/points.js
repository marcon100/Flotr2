/** Points **/
Flotr.addType('points', {
  options: {
    show: false,           // => setting to true will show points, false will hide
    radius: 3,             // => point radius (pixels)
    lineWidth: 2,          // => line width in pixels
    fill: true,            // => true to fill the points with a color, false for (transparent) no fill
    fillColor: '#FFFFFF',  // => fill color
    fillOpacity: 0.4       // => opacity of color inside the points
  },

  draw : function (options) {
    var
      context     = options.context,
      lineWidth   = options.lineWidth,
      shadowSize  = options.shadowSize;

    context.save();
    context.translate(options.offsetLeft, options.offsetTop);
    
    if (shadowSize > 0) {
      context.lineWidth = shadowSize / 2;
      
      context.strokeStyle = 'rgba(0,0,0,0.1)';
      this.plotShadows(options, shadowSize / 2 + context.lineWidth / 2)

      context.strokeStyle = 'rgba(0,0,0,0.2)';
      this.plotShadows(options, context.lineWidth / 2)
    }

    context.lineWidth = options.lineWidth;
    context.strokeStyle = options.color;
    context.fillStyle = options.fillStyle;

    this.plot(options);
    context.restore();
  },

  plot : function (options, offset) {
    var
      data    = options.data,
      context = options.context,
      xScale  = options.xScale,
      yScale  = options.yScale,
      i, x, y;
      
    for (i = data.length - 1; i > -1; --i) {
      x = data[i][0];
      y = data[i][1];

      if (y === null) continue;

      // TODO skipping
      //if (x < xa.min || x > xa.max || y < ya.min || y > ya.max) continue;
      
      context.beginPath();
      context.arc(xScale(x), yScale(y), options.radius, 0, 2 * Math.PI, true);
      if (options.fill) context.fill();
      context.stroke();
      context.closePath();
    }
  },
  plotShadows : function (series, offset, radius) {
    return;
    var xa = series.xaxis,
        ya = series.yaxis,
        ctx = this.ctx,
        data = series.data,
        i, x, y;
      
    for(i = data.length - 1; i > -1; --i){
      x = data[i][0];
      y = data[i][1];
      if (y === null || x < xa.min || x > xa.max || y < ya.min || y > ya.max)
        continue;
      ctx.beginPath();
      ctx.arc(xa.d2p(x), ya.d2p(y) + offset, radius, 0, Math.PI, false);
      ctx.stroke();
      ctx.closePath();
    }
  },
  getHit: function(series, pos) {
    var xdiff, ydiff, i, d, dist, x, y,
        o = series.points,
        data = series.data,
        sens = series.mouse.sensibility * (o.lineWidth + o.radius),
        hit = {
        index: null,
        series: series,
        distance: Number.MAX_VALUE,
        x: null,
        y: null,
        precision: 1
        };
    
    for (i = data.length-1; i > -1; --i) {
      d = data[i];
      x = series.xaxis.d2p(d[0]);
      y = series.yaxis.d2p(d[1]);
      xdiff = x - pos.relX;
      ydiff = y - pos.relY;
      dist = Math.sqrt(xdiff*xdiff + ydiff*ydiff);
      
      if (dist < sens && dist < hit.distance) {
        hit = {
          index: i,
          series: series,
          distance: dist,
          data: d,
          x: x,
          y: y,
          precision: 1
        };
      }
    }
    
    return hit;
  },
  drawHit: function(series, index) {
    
  },
  clearHit: function(series, index) {
    
  }
});
