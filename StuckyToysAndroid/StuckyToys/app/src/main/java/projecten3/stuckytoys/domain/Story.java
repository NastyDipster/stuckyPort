package projecten3.stuckytoys.domain;

import java.util.Date;
import java.util.List;

import io.realm.RealmList;
import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;

public class Story extends RealmObject {

    @PrimaryKey
    private String _id;
    private String name;
    private Date date;
    private String path;
    private byte[] picture;
    private RealmList<Scene> scenes;
    private RealmList<Theme> themes;
    private boolean purchased = false;
    private double price;
    private double duration;

    public Story() {

    }

    public Story(String _id, String name, Date date, String path, RealmList<Scene> scenes, RealmList<Theme> themes, boolean purchased) {
        this._id = _id;
        this.name = name;
        this.date = date;
        this.path = path;
        this.scenes = scenes;
        this.themes = themes;
    }

    public String get_id() {
        return _id;
    }
    public void set_id(String _id) {
        this._id = _id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Date getDate() {
        return date;
    }
    public void setDate(Date date) {
        this.date = date;
    }
    public RealmList<Scene> getScenes() {
        return scenes;
    }
    public void setScenes(RealmList<Scene> scenes) {
        this.scenes = scenes;
    }
    public RealmList<Theme> getThemes() {
        return themes;
    }
    public void setThemes(RealmList<Theme> themes) {
        this.themes = themes;
    }
    public boolean isPurchased() {
        return purchased;
    }
    public void setPurchased(boolean purchased) {
        this.purchased = purchased;
    }
    public double getPrice() {
        return price;
    }
    public void setPrice(double price) {
        this.price = price;
    }
    public double getDuration() {
        return duration;
    }
    public void setDuration(double duration) {
        this.duration = duration;
    }
    public String getPath() {
        return path;
    }
    public void setPath(String path) {
        this.path = path;
    }
    public byte[] getPicture() {
        return picture;
    }
    public void setPicture(byte[] picture) {
        this.picture = picture;
    }
}
