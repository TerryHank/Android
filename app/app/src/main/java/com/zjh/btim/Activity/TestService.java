package com.zjh.btim.Activity;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.GestureDescription;
import android.content.Context;
import android.graphics.Path;
import android.os.Build;
import android.os.Handler;

import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Display;
import android.view.WindowManager;
import android.view.accessibility.AccessibilityEvent;
import android.widget.Toast;

import com.zjh.btim.Bean.SPoint;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;


public class TestService extends AccessibilityService {

    public static final String TAG = "TestService";
    public float lastZ = -1.0f;

    public float startX = 0.0f;
    public float startY = 0.0f;
    //是否滑动
    public boolean isMove = false;
    public final int moveDis = 60;

    public int sw = 0;
    public int sh = 0;


    public TestService() {
        Log.v(TAG, "start TestTouch");
    }

    @Override
    public void onCreate() {
        super.onCreate();
        DisplayMetrics dm = new DisplayMetrics();
        dm = getResources().getDisplayMetrics();
        sw = dm.widthPixels; // 屏幕宽(像素，如：480px)
        sh = dm.heightPixels; // 屏幕高(像素，如：800px)

        EventBus.getDefault().register(this);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        EventBus.getDefault().unregister(this);
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onRecEventBus(SPoint point){
        perform_click((float)point.x, (float)point.y, (float)point.z);
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        int eventType = event.getEventType();
        String packageName = event.getPackageName().toString();
        String className = event.getClassName().toString();
        if ("com.zjh.btim".equals(packageName)) {
//            perform_click(200.0f, 200.0f);
        }else{

        }
    }

    private void perform_click(float x, float y, float z) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            if (z == 1){ //1 点击
                Path path = new Path();
                path.moveTo(x, y);

                boolean click = dispatchGesture(new GestureDescription
                        .Builder()
                        .addStroke(new GestureDescription.StrokeDescription(path, 0, 100)).build(),null, null);
            }else if (z==2){ //2 长按
                Path path = new Path();
                path.moveTo(x, y);
                boolean click = dispatchGesture(new GestureDescription
                        .Builder()
                        .addStroke(new GestureDescription.StrokeDescription(path, 0, 600)).build(),null, null);
            }
        }
    }

    @Override
    public void onInterrupt() {
        Log.v(TAG, "----onInterrupt-----");
    }

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        Log.v(TAG, "----onServiceConnected-----");
    }

}
