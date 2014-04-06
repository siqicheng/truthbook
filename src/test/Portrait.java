package test;

import javax.xml.bind.annotation.XmlTransient;

/**
 * Portrait entity. @author MyEclipse Persistence Tools
 */

public class Portrait implements java.io.Serializable {
	
	// Table Name
	
	public static final String TABLE = "Portrait";
	
	// DB Mapping info
	
	public static final String ID = "id";
	public static final String IMAGE_ID = "image";
	public static final String USER_ID = "user";
	public static final String DEFAULT_IMAGE = "defaultImage";
	
	// Fields

	private Integer id;
	private Image image;
	private User user;
	private String defaultImage;
	
	

	// Constructors

	/** default constructor */
	public Portrait() {
	}

	/** full constructor */
	public Portrait(Image image, User user, String defaultImage) {
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
	
	@XmlTransient
	public Image getImage() {
		return this.image;
	}

	public void setImage(Image image) {
		this.image = image;
	}
	
	@XmlTransient
	public User getUser() {
		return this.user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getDefaultImage() {
		return this.defaultImage;
	}

	public void setDefaultImage(String defaultImage) {
		this.defaultImage = defaultImage;
	}

}