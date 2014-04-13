package db.mapping.object;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlTransient;

import db.mapping.object.User;

/**
 * Message entity. @author MyEclipse Persistence Tools
 */

@XmlRootElement
@XmlSeeAlso({User.class})
public class Message implements java.io.Serializable {

	// Fields

	private Integer messageId;
	private String messageType;
	private Integer userId;
	private User friend;
	private Timestamp createTime;
	private Map<String,String> content;
	
	// Constructors

	/** default constructor */
	public Message() {
		this.content = new HashMap();
		this.content.put("status", "unsend");
	}

	/** full constructor */
	public Message(String messageType, Integer userId, User friend
			, Timestamp createTime) {
		this.content = new HashMap();
		this.messageType = messageType;
		this.userId = userId;
		this.friend = friend;
		this.createTime = createTime;
		this.content.put("status", "unsend");
	}

	// Property accessors

	@XmlTransient
	public String getStatus(){
		if (this.content.containsKey("status")){
			return this.content.get("status");
		}
		return null;
	}

	
	public void setStatus(String status){
		this.content.put("status", status);
	}
	
	@XmlTransient
	public Map<String,String> getContent(){
		return this.content;
	}
	
	public Integer getMessageId() {
		return this.messageId;
	}

	public void setMessageId(Integer messageId) {
		this.messageId = messageId;
	}

	public String getMessageType() {
		return this.messageType;
	}

	public void setMessageType(String messageType) {
		this.messageType = messageType;
	}

	public Integer getUserId() {
		return this.userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	
//	@XmlTransient
	public User getFriend() {
		return this.friend;
	}

	public void setFriend(User friend) {
		this.friend=friend;
	}
	
	@XmlTransient
	public Timestamp getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}