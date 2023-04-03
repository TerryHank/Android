package com.zjh.btim.Interface;

import android.content.Context;
import android.os.Environment;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.widget.Toast;
import java.io.File;
import java.io.FileOutputStream;
import java.text.DateFormat;
import java.util.Date;

public class DownloadBlobFileJSInterface {

    private Context mContext;
    private DownloadCsvSuccessListener mDownloadCsvSuccessListener;

    public DownloadBlobFileJSInterface(Context context) {
        this.mContext = context;
    }

    public void setDownloadCsvSuccessListener(DownloadCsvSuccessListener listener) {
        mDownloadCsvSuccessListener = listener;
    }

    @JavascriptInterface
    public void getBase64FromBlobData(String base64Data, String filename)  {
        convertToCsvAndProcess(base64Data, filename);
    }

    private void convertToCsvAndProcess(String base64, String filename) {
        File csvFile = new File(Environment.getExternalStoragePublicDirectory(
                Environment.DIRECTORY_DOWNLOADS) + "/" + filename);
        saveCsvToPath(base64, csvFile);
        Toast.makeText(mContext, "文件保存成功，路径: " + csvFile.getPath(), Toast.LENGTH_SHORT).show();
        if (mDownloadCsvSuccessListener != null) {
            mDownloadCsvSuccessListener.downloadCsvSuccess(csvFile.getAbsolutePath());
        }
    }

    private void saveCsvToPath(String base64, File csvFilePath) {
        try {
            byte[] fileBytes = Base64.decode(base64.replaceFirst(
                    "data:text/csv;base64,", ""), 0);
            FileOutputStream os = new FileOutputStream(csvFilePath, false);
            os.write(fileBytes);
            os.flush();
            os.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static String getFileName(String blobUrl) {
        String[] components = blobUrl.split("/");
        String filename = components[components.length-1];
        return filename;
    }

    public interface DownloadCsvSuccessListener {
        void downloadCsvSuccess(String absolutePath);
    }
}
