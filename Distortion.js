/*
 * Module:      Distortion
 *
 * Description: give image a barrel distortion for VR viewer
 * 
 * http://smus.com/vr-lens-distortion/
 * https://github.com/googlevr/webvr-polyfill/blob/master/src/cardboard-distorter.js
 */
class Distortion
{
    constructor(canvas, context, img)
    {
        this._img = img;
        this._canvas = canvas;
        this._context = context;
        this._imageData = this._context.getImageData(0,0,this._canvas.width, this._canvas.height);
        this._halfHeight = this._canvas.height/2;
        this.createCurve();
    }
    
    createCurve()
    {
        this._lut = [];
        for(var i=0; i<this._halfHeight; i++)
            this._lut.push(Math.pow(i, 2) / this._halfHeight);
    }
    
    barrel()
    {
        this.displaceRows();
        this.displaceColumns();
    }
    
    /*
     * compress rows
     */
    displaceRows()
    {
        var canvas = document.createElement('canvas');
        canvas.id     = "pixelRow";
        canvas.width  = this._canvas.width;
        canvas.height = 1;

        for(var y=0; y<this._canvas.height; y++)
        {
            // find pixel boundaries
            var index = Math.abs(this._halfHeight-y);
            var MAGIC_NUM = 20;
            var magnitude = Math.round(this._lut[Math.round(index)] / this._halfHeight * MAGIC_NUM);
            
            // left + right positions
            var left = magnitude;
            var right = this._canvas.width - magnitude;
            
            // distort pixels
            var x;
            for(x=0; x<=left; x++)
                this.setPixel(x,y, null);
            
            for(x=right; x<this._canvas.width; x++)
                this.setPixel(x,y, null);

            // linear interpolation for 1 line - compress
            this._context.drawImage(this._img,
                                    0,
                                    y,
                                    this._canvas.width,
                                    1,
                                    left,
                                    y,
                                    right-left,
                                    1);
        }
    }
    
    /*
     * compress columns
     */
    displaceColumns()
    {
        for(var x=0; x<this._canvas.width; x++)
        {
            for(var y=0; y<this._canvas.height; y++)
            {
                
            }  
        }
    }
    
    /*
     * Get pixel RGB value
     */
    getPixel(x, y)
    {
        // check x, y
        var index = ( this._canvas.width * y + x ) * 4;
        var color = {B:this._imageData.data[index],
                     G:this._imageData.data[index+1],
                     R:this._imageData.data[index+2],
                     A:this._imageData.data[index+3]};
        return color;
    }
    
    /*
     * Set 1 pixel RGB value
     * - assume context is the entire image
     */
    setPixel(x, y, color)
    {
        // check x, y
        // check value to have R, G, B
        var index = ( this._canvas.width * y + x ) * 4;
        
        if(null==color)
        {
            this._imageData.data[index] = 0;
            this._imageData.data[index+1] = 0;
            this._imageData.data[index+2] = 0;
            this._imageData.data[index+3] = 0;
        }
        else
        {
            this._imageData.data[index] = color.B;
            this._imageData.data[index+1] = color.G;
            this._imageData.data[index+2] = color.R;
            this._imageData.data[index+3] = color.A;
        }
    }
}