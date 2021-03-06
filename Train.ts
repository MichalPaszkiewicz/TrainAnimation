module Animation{
    
    function drawStar(ctx, cx,cy,spikes,outerRadius,innerRadius){
      var rot=Math.PI/2*3;
      var x=cx;
      var y=cy;
      var step=Math.PI/spikes;

      ctx.beginPath();
      ctx.moveTo(cx,cy-outerRadius)
      for(var i=0;i<spikes;i++){
        x=cx+Math.cos(rot)*outerRadius;
        y=cy+Math.sin(rot)*outerRadius;
        ctx.lineTo(x,y)
        rot+=step

        x=cx+Math.cos(rot)*innerRadius;
        y=cy+Math.sin(rot)*innerRadius;
        ctx.lineTo(x,y)
        rot+=step
      }
      ctx.lineTo(cx,cy-outerRadius);
      ctx.closePath();
      ctx.strokeStyle='orange';
      ctx.stroke();
      ctx.fillStyle='yellow';
      ctx.fill();
    }
    
    export class Colours{
        static Black = "black";
        static White = "white";
        static Blue = "blue";
        static Red = "red";
        static Yellow = "yellow";
    }
    
    interface IDrawable{
        draw: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void;
    }
    
    export class Drawing implements IDrawable{
        protected _x = 0;
        protected _y = 0;
        
        draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D){
            
        }
        
        update(x, y){
            this._x += x;
            this._y += y;
        }
    }

    export class Carriage extends Drawing{
        static Seperator: number = 10;
        static Length: number = 700;
        static Height: number = 100;
        
        constructor(x: number, y: number){
            super();
            this._x = x;
            this._y = y;
        }
        
        draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D){
            var margin = Carriage.Length / 20;
            var blueBand = Carriage.Height / 6;
            var doorWidth = Carriage.Length / 15;
            
            ctx.strokeStyle = Colours.Black;
            
            //red front and end
            ctx.beginPath();
            ctx.fillStyle = Colours.Red;
            ctx.rect(this._x, this._y, Carriage.Length, Carriage.Height);
            ctx.fill();
            ctx.stroke();
            
            //white middle
            ctx.beginPath();
            ctx.fillStyle = Colours.White;
            ctx.rect(this._x + margin, this._y, Carriage.Length - 2 * margin, Carriage.Height);
            ctx.fill();
            ctx.stroke();
            
            //blue bottom
            ctx.beginPath();
            ctx.fillStyle = Colours.Blue;
            ctx.rect(this._x + margin, this._y + Carriage.Height - blueBand, Carriage.Length - 2 * margin, blueBand);
            ctx.fill();
            
            //top line
            ctx.beginPath();
            ctx.rect(this._x + margin, this._y, Carriage.Length - 2 * margin, blueBand / 4);
            ctx.rect(this._x + margin, this._y + blueBand / 4, Carriage.Length - 2 * margin, blueBand / 4);
            ctx.stroke();
            
            //windows
            this.drawWindowSegment(ctx, this._x + margin, this._y, blueBand, Carriage.Length / 4 - margin);
            var left = this._x + Carriage.Length / 4 + 2 * doorWidth;
            var right = this._x + Carriage.Length * 3 / 4 - 2 * doorWidth;
            var width = right - left;
            this.drawWindowSegment(ctx, left, this._y, blueBand, width);
            this.drawWindowSegment(ctx, left + width + 2 * doorWidth, this._y, blueBand, Carriage.Length / 4 - margin);
            
            //doors
            this.drawDoor(ctx, this._x + Carriage.Length / 4, this._y, blueBand, doorWidth);
            this.drawDoor(ctx, this._x + Carriage.Length * 3 / 4 - 2 * doorWidth, this._y, blueBand, doorWidth);
        }
        
        drawDoor(ctx, x, y, blueBand, doorWidth){
            ctx.fillStyle = Colours.Red;
            ctx.beginPath();
            ctx.rect(x, y + blueBand / 2, doorWidth, Carriage.Height - blueBand / 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.rect(x + doorWidth, y + blueBand / 2, doorWidth, Carriage.Height - blueBand / 2);
            ctx.fill();
            ctx.stroke();
            this.drawWindow(ctx, x + doorWidth * 1 / 3, y + blueBand, doorWidth * 1 / 2, Carriage.Height * 2 / 5);
            this.drawWindow(ctx, x + doorWidth * 5 / 3 - doorWidth / 2, y + blueBand, doorWidth * 1 / 2, Carriage.Height * 2 / 5)
        }
        
        drawWindowSegment(ctx, x, y, blueBand, width){
            this.drawWindow(ctx, x + width / 20,  y + blueBand + 5, width * 0.425, Carriage.Height * 2 / 5 - 5);
            this.drawWindow(ctx, x + width / 2 + width * 0.075 - width / 20,  y + blueBand + 5, width * 0.425, Carriage.Height * 2 / 5 - 5);
        }
        
        drawWindow(ctx: CanvasRenderingContext2D, x, y, width, height){
            var cornerRadius = Math.min(width, height) / 4;
            ctx.beginPath();
            ctx.fillStyle = Colours.White;
            ctx.moveTo(x ,y + cornerRadius);
            ctx.arc(x + cornerRadius, y + cornerRadius, cornerRadius, Math.PI, Math.PI * 3 / 2);
            ctx.lineTo(x + width - cornerRadius, y);
            ctx.arc(x + width - cornerRadius, y + cornerRadius, cornerRadius, Math.PI * 3 / 2, 2 * Math.PI);
            ctx.lineTo(x + width, y + height - cornerRadius);
            ctx.arc(x + width - cornerRadius, y + height - cornerRadius, cornerRadius, 0, Math.PI / 2);
            ctx.lineTo(x + cornerRadius, y + height);
            ctx.arc(x + cornerRadius, y + height - cornerRadius, cornerRadius, Math.PI / 2, Math.PI);
            ctx.lineTo(x, y + cornerRadius);
            ctx.fill();
            ctx.stroke();
        }
        
    }

    export class Train extends Drawing{
        
        private _canvas: HTMLCanvasElement;
        private _ctx: CanvasRenderingContext2D;
        
        private _carriages: Carriage[] = [];
        private _initTime: number = (new Date()).getTime();
        
        constructor(id: string){
            super();
            this._canvas = <HTMLCanvasElement>document.getElementById(id);
            this._ctx = this._canvas.getContext("2d");
            
            for(var i = 0; i < 3; i++){
                this._carriages.push(new Carriage(- i * (Carriage.Length + Carriage.Seperator), 10));
            }
            
            this.draw(this._canvas, this._ctx);
        }
        
        draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D){
            canvas.height = 120; //(<HTMLElement>canvas.parentNode).offsetHeight;
		    canvas.width = (<HTMLElement>canvas.parentNode).offsetWidth;
                        
            var width = canvas.width;
            var height = canvas.height;
            
            this.update();
            
            ctx.clearRect(0,0, width, height);
            
            ctx.beginPath();
            ctx.fillStyle = Colours.Black;
            ctx.font = "50px Arial";
            
            ctx.fillText("Master Data", 60, 60);
            
            for(var i = 0; i < 5; i++){
                drawStar(ctx, 130 + i * 30, 85, 5, 10, 6);
            }
                        
            for(var i = 0; i < this._carriages.length; i++){
                this._carriages[i].draw(canvas, ctx);
            }
            
            var self = this;
            
            window.requestAnimationFrame(function(){
                self.draw(canvas, ctx);
            });
        }
        
        update(){
            var previousX = this._x;
            var timeElapsed = (new Date()).getTime() - this._initTime;
            this._x = (timeElapsed / 3) % (Carriage.Length * 8) - Carriage.Length;
            
            
            
            var deltaX = this._x - previousX;
            
            this._carriages.forEach(function(carriage: Carriage){
                    carriage.update(deltaX, 0);
            });            
        }
        
    }

}
