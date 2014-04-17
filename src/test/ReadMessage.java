package test;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlTransient;

import db.mapping.object.Message;
import db.mapping.object.User;

/**
 * ReadMessage entity. @author MyEclipse Persistence Tools
 */

@XmlRootElement
@XmlSeeAlso({User.class})

public class ReadMessage implements

		java.io.Serializable {

	// Fields

	private Integer messageId;
	private String messageType;
	private Integer userId;
	private User friend;
	private Timestamp createTime;
	private Timestamp readTime;
	private Map<String,String> content;
	
	
	// Constructors

	/** default constructor */
	public ReadMessage() {
	//	this.content = new HashMap();
	}

	public ReadMessage(Message message){
		this.messageId = message.getMessageId();
		this.messageType = message.getMessageType();
		this.userId = message.getUserId();
		this.friend = message.getFriend();
		this.createTime = message.getCreateTime();
		this.readTime = new Timestamp(System.currentTimeMillis());
//		this.content = message.getContent();
	}
	
	/** full constructor */
	public ReadMessage(String messageType, Integer userId, User friend,
			Timestamp createTime, Timestamp readTime) 
	{
		this.messageType = messageType;
		this.userId = userId;
		this.friend = friend;
		this.createTime = createTime;
		this.readTime = readTime;
//		this.content = new HashMap();
	}

	// Property accessors

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

	public User getFriend() {
		return this.friend;
	}

	public void setFriend(User friend) {
		this.friend = friend;
	}

	@XmlTransient
	public Timestamp getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@XmlTransient
	public Timestamp getReadTime() {
		return this.readTime;
	}

	public void setReadTime(Timestamp readTime) {
		this.readTime = readTime;
	}

}