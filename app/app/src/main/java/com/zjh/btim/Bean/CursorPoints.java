package com.zjh.btim.Bean;



import java.util.ArrayList;
import java.util.List;

/**
 * @author chengwl
 * @des
 * @date:2023/3/4
 */
public class CursorPoints {
    public String type= "cursor";
    List<Point> points;

    public List<Point> getPoints() {
        if (points == null) {
            return new ArrayList<>();
        }
        return points;
    }

    public void setPoints(List<Point> points) {
        this.points = points;
    }

    public void addPoint(double x, double y, double value){
        if (points == null){
            points = new ArrayList<>();
        }
        points.add(new Point(x,y,value));
    }
    public void clear(){
        points.clear();
    }
    public static class Point{
        public double x;
        public double y;
        public double value;

        public Point(double x, double y, double value) {
            this.x = x;
            this.y = y;
            this.value = value;
        }
    }
}
