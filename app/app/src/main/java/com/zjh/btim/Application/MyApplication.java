package com.zjh.btim.Application;

import android.app.Application;
import android.view.WindowManager;

public class MyApplication extends Application {

    private WindowManager.LayoutParams wmParams = new WindowManager.LayoutParams();

    @Override
    public void onCreate() {
        super.onCreate();

    }

    public WindowManager.LayoutParams getMywmParams() {
        if (wmParams == null){
            wmParams = new WindowManager.LayoutParams();
        }
        wmParams.flags = WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL |       //该flags描述的是窗口的模式，是否可以触摸，可以聚焦等
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE | WindowManager.LayoutParams.FLAG_FULLSCREEN | WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN;
        return wmParams;

    }

}