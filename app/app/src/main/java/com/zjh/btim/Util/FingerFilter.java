package com.zjh.btim.Util;

import android.graphics.RectF;
import android.text.TextUtils;
import android.util.Log;


import com.zjh.btim.Activity.MyFloatView;
import com.zjh.btim.Bean.SPoint;

import org.greenrobot.eventbus.EventBus;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.concurrent.atomic.AtomicInteger;

/**
 *@author chengwl
 *@des
 *@date:2023/3/2
 */public class FingerFilter {
     private  volatile long lastTriggerTime;
     private volatile long lastClickTime; //上次点击时间
     private volatile boolean isLast,isLongPress;//isLast 是否持续大于触发值、是否是长按
     private volatile long triggerStartTime,currentTime,triggerLastTime;//第一次大于触发值的时间、当前时间、大于触发值的最新时间
     private volatile boolean hasInit = false;
     private volatile double lastX=-1,lastY=-1;//上次点击的坐标
     private static final String TAG = "FingerFilter";
     private double triggerValue = 20,
             singleClickTime = 1000, intervalTime = 1500;
     private String mac;

     private boolean isSelf;
     private RectF lastClickRect = new RectF(0,0,0,0);
     private int l;

     private AtomicInteger  lastGx ,lastGy;
     private int width,height;



     public FingerFilter(double triggerValue,
                         double intervalTime,int l, int width, int height){

          this.width = width;
          this.height = height;
          lastGx = new AtomicInteger(width/2);
          lastGy = new AtomicInteger(height/2);
          Log.i("FingerFilter","arrowShow 显示重新复制");
          this.triggerValue = triggerValue;
          this.intervalTime = intervalTime;
          this .l = l;
     }
     private static final Object lock = new Object() ;
     public synchronized void arrowShow(float x, float y, float z, MyFloatView myFV){
          x = new BigDecimal(x).setScale(0, BigDecimal.ROUND_HALF_UP).intValue();
          y = new BigDecimal(y).setScale(0, BigDecimal.ROUND_HALF_UP).intValue();


               Log.i("FingerFilter","arrowShow 显示接收的偏移 x "+x+ " y "+y+Thread.currentThread().getName()+" lastx "+lastGx.get()+" lasty "+lastGy.get());

              lastGx.addAndGet((int) x);
               lastGy.addAndGet((int)y);
               Log.i("FingerFilter","arrowShow 显示坐标 x "+lastGx.get()+" 显示坐标 y "+lastGy.get()+" isSelf "+isSelf+" width "+width+" height "+height);
               if (lastGx.get()<-0){
                    lastGx.set(0);
               }
               if (lastGx.get()>width){
                   lastGx.set(width);
               }
               if (lastGy.get()<-0){
                   lastGy.set(0);
               }
               if (lastGy.get()>height){
                    lastGy.set(height);
               }
               myFV.updateArrow(lastGx.get(), lastGy.get());
               Log.i("FingerFilter","arrowShow 显示坐标越界判断后 x "+lastGx.get()+" 显示坐标 y "+lastGy.get()+" isSelf "+isSelf+" width "+width+" height "+height);





     }
     public void filter(float u,float v,float  n,MyFloatView myFV){

          u = lastGx.get() + u;
          v = lastGy.get() + v;
          isLongPress  = false;
          currentTime = System.currentTimeMillis();
        //  Log.e(TAG,"x "+x+" "+" y "+y+" n "+z +" 持续时间 "+(currentTime - triggerStartTime)+" 两次点击时间 "+(currentTime - lastClickTime));


          if (lastClickRect == null||(currentTime - lastClickTime>intervalTime)){
               if (n>triggerValue)
                 click(u,v,n);
          }else {
               if (!lastClickRect.contains(u,v)){
                    if (n>triggerValue)
                      click(u,v,n);
               }
          }
          updateCursor(u,v,isLongPress?2:0,n,myFV);
     }
     private void click(float u,float v,float  n){
          update(u,v,1,n);
          if (lastClickRect!=null){
               lastClickRect.set((u-l),v-l,u+l,v+l);
          }
          lastClickTime = currentTime;
     }

     private void update(double u ,double v,double newN,double n) {
          //发送点击事件
          EventBus.getDefault().post(new SPoint(u, v, newN));
//          testTv.setText(format.format(new Date()) + " u:" +  String.format("%.3f",fingerx) + " v:" + String.format("%.3f",fingerx) + " " +
//                  "d:" + String.format("%.3f",fingerz) + "\n" + String.format("%.3f",u) + "," + String.format("%.3f",v) + "," + String.format("%.3f",n));
     }

     private void updateCursor(double u , double v, double newN, double n, MyFloatView myFV){
          int value = 0;
          if (n < 0) {
               value = -1;
          } else if (n >= 0 && n < triggerValue) {
               value = 0;
          } else if (n>=triggerValue){
               value = 1;
          }
          if (newN == 2){
               value = 2;
          }
          //更新手表本身光标
          myFV.updateViewPosition(u, v, value);
     }
}
