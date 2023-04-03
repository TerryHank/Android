package com.zjh.btim.View;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.view.View;


/**
 * author : Louris
 * e-mail : 707086447@qq.com
 * time   : 2021/04/07
 * desc   :
 */
public class SZCustomView extends View {

    private Paint paint;

    private float x;
    private float y;
    private float z;

    public SZCustomView(Context context) {
        super(context);
        paint = new Paint();
        paint.setAntiAlias(true); // 是否抗锯齿
        paint.setAlpha(50); // 设置alpha不透明度，范围为0~255

        //设置画笔属性
        paint.setStyle(Paint.Style.FILL);//画笔属性是实心圆
        paint.setStrokeWidth(4);//设置画笔粗细
    }

    public SZCustomView(Context context, AttributeSet attrs) {
        super(context, attrs);
        paint = new Paint();
        paint.setAntiAlias(true); // 是否抗锯齿
        paint.setAlpha(50); // 设置alpha不透明度，范围为0~255
        //设置画笔属性
        paint.setStyle(Paint.Style.FILL);//画笔属性是实心圆
        paint.setStrokeWidth(4);//设置画笔粗细
    }

    @Override
    protected void onDraw(Canvas canvas) {
        if(z >= 0){
            paint.setColor(Color.GREEN);//        给画笔设置颜色
        }else{
            paint.setColor(Color.RED);//        给画笔设置颜色
        }
        canvas.drawCircle(this.x, this.y, 50, paint);
    }

    public void updatePosition(double x, double y, double z){
        this.x = (float) x;
        this.y = (float) y;
        this.z = (float) z;
        postInvalidate();
    }


    public void updatePosition(float x, float y, float z){
        this.x = x;
        this.y = y;
        this.z = z;
        postInvalidate();
    }


}
