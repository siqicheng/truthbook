package db.mapping.object;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/**
 * Portrait entity. @author MyEclipse Persistence Tools
 */
@XmlRootElement
public class Portrait implements java.io.Serializable {
	// Fields

	private Integer id;
	private Image image;
	private User user;
	private Boolean defaultImage;

	// Constructors

	/** default constructor */
	public Portrait() {
	}

	/** full constructor */
	public Portrait(Image image, User user, Boolean defaultImage) {
		this.image = image;
		this.user = user;
		this.defaultImage = defaultImage;
	}

	// Property accessors

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}
	public Image getImage() {
		return this.image;
	}

	public void setImage(Image image) {
		this.image = image;
	}
	public User getUser() {
		return this.user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Boolean getDefaultImage() {
		return this.defaultImage;
	}

	public void setDefaultImage(Boolean defaultImage) {
		this.defaultImage = defaultImage;
	}

}