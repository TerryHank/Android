package com.zjh.btim.Bean;

import java.io.Serializable;

/**
 * @author chengwl
 * @des
 * @date:2023/3/5
 */
public class Config implements Serializable {
    public String type= "config";
    private double triggerValue = 20;
    private double intervalTime = 1500;
    private int l;

    public Config(double triggerValue, double intervalTime, int l) {
        this.triggerValue = triggerValue;
        this.intervalTime = intervalTime;
        this.l = l;
    }

    public double getTriggerValue() {
        return triggerValue;
    }

    public void setTriggerValue(double triggerValue) {
        this.triggerValue = triggerValue;
    }

    public double getIntervalTime() {
        return intervalTime;
    }

    public void setIntervalTime(double intervalTime) {
        this.intervalTime = intervalTime;
    }

    public int getL() {
        return l;
    }

    public void setL(int l) {
        this.l = l;
    }
}
