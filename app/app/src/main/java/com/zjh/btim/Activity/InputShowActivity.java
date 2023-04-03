package com.zjh.btim.Activity;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.ActivityManager;
import android.app.DownloadManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.AssetManager;
import android.graphics.PixelFormat;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.MimeTypeMap;
import android.webkit.PermissionRequest;
import android.webkit.URLUtil;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.zjh.btim.Application.MyApplication;
import com.zjh.btim.Bean.Config;
import com.zjh.btim.Bean.CursorPoints;
import com.zjh.btim.Bean.SPoint;
import com.zjh.btim.Interface.DownloadBlobFileJSInterface;
import com.zjh.btim.R;
import com.zjh.btim.Service.BluetoothChatService;
import com.zjh.btim.Util.DensityUtil;
import com.zjh.btim.Util.FingerFilter;

import org.greenrobot.eventbus.EventBus;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static com.zjh.btim.Activity.MainActivity.BLUE_TOOTH_READ;
import static com.zjh.btim.Activity.MainActivity.BLUE_TOOTH_TOAST;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.webkit.WebViewAssetLoader;

/**
 * author : Louris
 * e-mail : 707086447@qq.com
 * time   : 2020/12/21
 * desc   :
 */
public class InputShowActivity extends Activity {

    private String TAG = "InputShowActivity";

    private BluetoothChatService bluetoothChatService;

    private WindowManager wm;
    private WindowManager.LayoutParams wmParams;
    private MyFloatView arrowView;
    private List<MyFloatView> myFloatViewList;
    private WebView webView;
    public AssetManager assetManager;
    private int y, zt;
    FingerFilter fingerFilter;
    private int width ,height;

    private Handler handler = new Handler() {
        @SuppressLint("HandlerLeak")
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            switch (msg.what) {
                case BLUE_TOOTH_READ: //收到蓝牙对方过来的数据
                    String readMessage = (String) msg.obj;
                    try {
                        JSONObject json = new JSONObject(readMessage);
                        if (json.get("type").equals("config")){
                            Config config = new Gson().fromJson(readMessage,Config.class);
                            fingerFilter = new FingerFilter(config.getTriggerValue(),config.getIntervalTime(),config.getL(),width,height);
                        }else if (json.get("type").equals("single")){
                            double x = json.getDouble("x");
                            double y = json.getDouble("y");
                            double z = json.getDouble("z");
                            boolean isShowArrow = json.getBoolean("isShowArrow");
                            Log.i(TAG,"isShowArrow "+isShowArrow);
                            webView.evaluateJavascript("javascript:receiveMainCoordinate("+x+","+y+","+z+","+isShowArrow+")",null);
//                            if (isShowArrow){ //意图是更新箭头显示
//
//                                fingerFilter.arrowShow((float)x, (float) (y),(float)z,arrowView);
//                            }
                        }else if (json.get("type").equals("cursor")){
                            CursorPoints cursorPoints = new Gson().fromJson(readMessage,CursorPoints.class);
//                            for (int j=cursorPoints.getPoints().size();j<myFloatViewList.size();j++){
//                                myFloatViewList.get(j).setGone();
//                            }
                            for (int i=0;i<cursorPoints.getPoints().size();i++){
                                CursorPoints.Point point = cursorPoints.getPoints().get(i);
                                webView.evaluateJavascript("javascript:receiveSubBallCoordinate("+point.x+","+point.y+","+point.value+","+i+"," + (cursorPoints.getPoints().size() - 1) + ")",null);

//
//                                fingerFilter.filter((float)point.x, (float)point.y,(float)point.value,myFloatViewList.get(i));
                            }
                            // 剩余的隐藏
                            for (int i=cursorPoints.getPoints().size();i<4;i++){
                                webView.evaluateJavascript("javascript:receiveSubBallCoordinate(9999, 9999, 9999,"+i+")",null);
                            }
                        }
                        Log.i(TAG,"readMessage "+readMessage);

                        //inputShowTv.setText(readMessage);
                    } catch (JSONException e) {
                        Log.i(TAG,"ece"+e.getMessage());
                        e.printStackTrace();
                    }
                    break;
                case BLUE_TOOTH_TOAST:
                    Log.d(TAG, "BLUE_TOOTH_TOAST --- ");
                    if (arrowView != null){
                        wm = (WindowManager) getSystemService(WINDOW_SERVICE);
                        wm.removeView(arrowView);
                    }
                    break;
            }
        }
    };

    public class PlaySoundScriptInterface {
        private Context mContext;
        private MediaPlayer mp;

        public PlaySoundScriptInterface(Context context) {
            mContext = context;
            mp = MediaPlayer.create(mContext, R.raw.clickbtn);
            mp.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                @Override
                public void onCompletion(MediaPlayer mediaPlayer) {
                    mediaPlayer.reset();
                    try {
                        mediaPlayer.setDataSource(mContext, Uri.parse("android.resource://" + mContext.getPackageName() + "/" + R.raw.clickbtn));
                        mediaPlayer.prepare();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            });
        }

        @JavascriptInterface
        public void playSound() {
            try {

                mp.start();
                
            } catch (Exception e) {

                Toast toast = Toast.makeText(mContext, "播放失败: " + e.getMessage(), Toast.LENGTH_SHORT);
                toast.show();
            }
        }
    }

    public class SdcardStoragePathHandler implements WebViewAssetLoader.PathHandler {
        @Nullable
        @Override
        public WebResourceResponse handle(@NonNull String filePath) {
            String extension = MimeTypeMap.getFileExtensionFromUrl(filePath);
            String mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
            try {
                return new WebResourceResponse(mimeType, "UTF-8", assetManager.open(filePath));
            } catch (Exception e) {
                return null;
            }
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.lnput_show_layout);
        WindowManager windowManager = getWindow().getWindowManager();
        DisplayMetrics metrics = new DisplayMetrics();
        windowManager.getDefaultDisplay().getRealMetrics(metrics);
//屏幕实际宽度（像素个数）
        width = metrics.widthPixels;
//屏幕实际高度（像素个数）
        height = metrics.heightPixels;
        webView = findViewById(R.id.web_view);
        //初始化蓝牙
        bluetoothChatService = BluetoothChatService.getInstance(handler);
        assetManager = getAssets();
        String appCachePath = getApplicationContext().getCacheDir().getAbsolutePath();
        webView.getSettings().setAppCachePath(appCachePath);
        webView.getSettings().setAllowFileAccess(true);
        webView.getSettings().setAppCacheEnabled(true);
        webView.getSettings().setMediaPlaybackRequiresUserGesture(false);
        webView.setWebContentsDebuggingEnabled(true);
        // 不需要了
        //申请权限
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
//            if(Settings.canDrawOverlays(getApplicationContext())) {
//                createFloatView();
//            }else{
//                //启动Activity让用户授权
//                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
//                intent.setData(Uri.parse("package:" + getPackageName()));
//                startActivityForResult(intent,100);
//            }
//        }

//        if (!isServiceON(this,TestService.class.getName())) {
//            goAccess();
//        } else {
//            Intent intent = new Intent(Intent.ACTION_MAIN);
//            intent.addCategory(Intent.CATEGORY_HOME);
//            startActivity(intent);
//        }

        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
            private WebViewAssetLoader webViewAssetLoader = new WebViewAssetLoader.Builder().addPathHandler("/android_asset/", new SdcardStoragePathHandler()).build();

            @Override
             public WebResourceResponse shouldInterceptRequest(WebView webView, String url) {
                return webViewAssetLoader.shouldInterceptRequest(Uri.parse(url));
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView webView, WebResourceRequest webResourceRequest) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    return webViewAssetLoader.shouldInterceptRequest(webResourceRequest.getUrl());
                }
                return null;
            }

        });
        webView.setWebChromeClient(new WebChromeClient() {
            @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                request.grant(request.getResources());
            }
        });
        webView.addJavascriptInterface(new DownloadBlobFileJSInterface(this), "download");

        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                webView.evaluateJavascript("javascript:getBase64(\"" + url + "\")", (val) -> {
                    System.out.println(val);
                });
            }
        });


        webView.addJavascriptInterface(new PlaySoundScriptInterface(this), "android");

        // 开启devtools调试
        webView.setWebContentsDebuggingEnabled(true);

        webView.loadUrl("https://appassets.androidplatform.net/android_asset/index.html");

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA}, 1);
        }

    }

    private void createFloatView() {
        if(arrowView == null){
            arrowView = new MyFloatView(getApplicationContext(),width,height);
            arrowView.setImageResource(R.drawable.icon_arrow);

            // 获取WindowManager
            wm = (WindowManager) getSystemService(WINDOW_SERVICE);
            // 设置LayoutParams(全局变量）相关参数
            wmParams = ((MyApplication) getApplication()).getMywmParams();
            // 设置窗体显示类型
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                wmParams.type = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
            } else {
                wmParams.type = WindowManager.LayoutParams.TYPE_PHONE;
            }
            wmParams.format = PixelFormat.RGBA_8888;// 设置图片格式，效果为背景透明
            wmParams.gravity = Gravity.LEFT | Gravity.TOP;// 调整悬浮窗口至左上角，便于调整坐标
            wmParams.x = 0;
            wmParams.y = 0;
            // 设置悬浮窗口长宽数据
            wmParams.width = DensityUtil.dip2px(this,20);
            wmParams.height = DensityUtil.dip2px(this,20);;
            // 显示myFloatView图像
            wm.addView(arrowView, wmParams);
        }
        if(myFloatViewList == null){
            myFloatViewList = new ArrayList<>();
            for (int i =0;i<4;i++){
                MyFloatView  myFloatView = new MyFloatView(getApplicationContext(),width,height);
                myFloatView.setImageResource(R.drawable.icon_arrow);

                // 获取WindowManager
                wm = (WindowManager) getSystemService(WINDOW_SERVICE);
                // 设置LayoutParams(全局变量）相关参数
                wmParams = ((MyApplication) getApplication()).getMywmParams();
                // 设置窗体显示类型
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    wmParams.type = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
                } else {
                    wmParams.type = WindowManager.LayoutParams.TYPE_PHONE;
                }
                wmParams.format = PixelFormat.RGBA_8888;// 设置图片格式，效果为背景透明
                wmParams.gravity = Gravity.LEFT | Gravity.TOP;// 调整悬浮窗口至左上角，便于调整坐标
                wmParams.x = 0;
                wmParams.y = 0;
                // 设置悬浮窗口长宽数据
                wmParams.width = DensityUtil.dip2px(this,20);
                wmParams.height = DensityUtil.dip2px(this,20);;
                // 显示myFloatView图像
                wm.addView(myFloatView, wmParams);
                myFloatViewList.add(myFloatView);
            }

        }

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // 在程序退出(Activity销毁）时销毁悬浮窗口
//        wm.removeView(myFV);
    }

//    @Override
//    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
//        super.onActivityResult(requestCode, resultCode, data);
//        if (requestCode == 100) {
//            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
//                if (Settings.canDrawOverlays(this)) {
//                    createFloatView();
//                } else {
//                    Toast.makeText(this, "ACTION_MANAGE_OVERLAY_PERMISSION权限已被拒绝", Toast.LENGTH_SHORT).show();
//                }
//            }
//        }
//    }

    private boolean isAccessibilitySettingsOn() {
        int accessibilityEnabled = 0;
        final String service = getPackageName() + "/" + TestService.class.getCanonicalName();
        Log.v(TAG, "service:" + service);
        try {
            accessibilityEnabled = Settings.Secure.getInt(getApplicationContext().getContentResolver(),
                    android.provider.Settings.Secure.ACCESSIBILITY_ENABLED);
            Log.v(TAG, "accessibilityEnabled = " + accessibilityEnabled);
        } catch (Settings.SettingNotFoundException e) {
            Log.e(TAG, "Error finding setting, default accessibility_config to not found: " + e.getMessage());
        }

        TextUtils.SimpleStringSplitter mStringColonSplitter = new TextUtils.SimpleStringSplitter(':');
        if (accessibilityEnabled == 1) {
            String settingValue = Settings.Secure.getString(getApplicationContext().getContentResolver(),
                    Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES);
            if (settingValue != null) {
                mStringColonSplitter.setString(settingValue);
                while (mStringColonSplitter.hasNext()) {
                    String accessibilityService = mStringColonSplitter.next();
                    if (accessibilityService.equalsIgnoreCase(service)) {
                        return true;
                    }
                }
            }
        } else {
            Log.v(TAG, "***ACCESSIBILITY IS DISABLED***");
        }
        return false;
    }
    public static boolean isServiceON(Context context, String className){

        ActivityManager activityManager = (ActivityManager)context.getSystemService(context.ACTIVITY_SERVICE);

        List<ActivityManager.RunningServiceInfo>

                runningServices = activityManager.getRunningServices(100);

        if (runningServices.size() < 0 ){

            return false;

        }

        for (int i = 0;i<runningServices.size();i++){

            ComponentName service = runningServices.get(i).service;

            if (service.getClassName().contains(className)){

                return true;

            }

        }

        return false;

    }


    public void goAccess() {
        Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
    }

    public void closeBtnListener(View view){
        Intent intent = new Intent(Intent.ACTION_MAIN);
        intent.addCategory(Intent.CATEGORY_HOME);
        startActivity(intent);
    }

    public void test(){
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                y = y + 50;
                zt ++;
                Message msg = new Message();
                msg.what = BLUE_TOOTH_READ;
                msg.obj = "{x:200;y:" + y + ";z:"  + (zt%5==1?"-1":"1") +  "}";
//                msg.obj = "{x:200;y:" + y + ";z:1"  + "}";

                handler.sendMessage(msg);

                if(y > 2200){
                    y = 0;
                }
                //循环发送
                test();
            }
        }, 500);


    }

}
