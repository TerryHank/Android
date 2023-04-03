package com.zjh.btim.Activity;

import static android.content.Context.WINDOW_SERVICE;

import android.content.Context;
import android.graphics.Canvas;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.WindowManager;

import androidx.appcompat.widget.AppCompatImageView;


import com.zjh.btim.Application.MyApplication;
import com.zjh.btim.R;
import com.zjh.btim.Util.DensityUtil;


public class MyFloatView extends AppCompatImageView {

    private float mTouchStartX;
    private float mTouchStartY;
    private float mTouchStartZ;

    //X方向偏移
    private int displacementX = 0;
    private double triggerValue = 20;

    private WindowManager wm = (WindowManager) getContext()
            .getApplicationContext().getSystemService(WINDOW_SERVICE);

    // 此wmParams变量为获取的全局变量，用以保存悬浮窗口的属性
    private WindowManager.LayoutParams wmParams = ((MyApplication) getContext()
            .getApplicationContext()).getMywmParams();

    private int width ,height;
    public MyFloatView(Context context,int width,int height) {
        super(context);
        displacementX = DensityUtil.dip2px(context, 10);
        this.width = width;
//屏幕实际高度（像素个数）
        this.height = height;
    }


    public void updateViewPosition(double touchStartX, double touchStartY, double touchStartZ) {
        this.mTouchStartX = (float) touchStartX;
        this.mTouchStartY = (float) touchStartY;
        this.mTouchStartZ = (float) touchStartZ;
        updateNewViewPosition();
    }

    public void updateArrow(float x,float y){
        setImageResource(R.drawable.icon_arrow);
        wmParams.x = (int) x;
        wmParams.y = (int) y;
      //  LogDebug.i("VIEW", "X:" + wmParams.x + " Y:" + wmParams.y);
        //刷新显示
        wm.updateViewLayout(this, wmParams);
    }


    private void updateViewPosition() {
        //更新浮动窗口位置参数
        if (mTouchStartZ < 0) {
            setImageResource(R.drawable.white_circular);
        } else if (mTouchStartZ >= 0 && mTouchStartZ < triggerValue) {
            setImageResource(R.drawable.yellow_circular);
        } else {
            setImageResource(R.drawable.green_circular);
        }

        wmParams.x = (int) mTouchStartX;
        wmParams.y = (int) mTouchStartY;
      //  LogDebug.i("VIEW", "X:" + wmParams.x + " Y:" + wmParams.y);
        //刷新显示
        wm.updateViewLayout(this, wmParams);
    }
    private void updateNewViewPosition() {
        //更新浮动窗口位置参数
        setVisibility(VISIBLE);
        if (mTouchStartZ < 0) {
            setImageResource(R.drawable.white_circular);
        } else if (mTouchStartZ == 0) {
            setImageResource(R.drawable.yellow_circular);
        } else if (mTouchStartZ == 1){
            setImageResource(R.drawable.green_circular);
        }else {
            setImageResource(R.drawable.blue_circluar);
        }

        Log.i("VIEW111","X:" + mTouchStartX + " Y:" + mTouchStartY);
        wmParams.x = (int) mTouchStartX;
        wmParams.y = (int) mTouchStartY;
       // LogDebug.i("VIEW", "X:" + wmParams.x + " Y:" + wmParams.y);
        //刷新显示
        wm.updateViewLayout(this, wmParams);
    }
    public void setGone(){
        setVisibility(GONE);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
    }
}


