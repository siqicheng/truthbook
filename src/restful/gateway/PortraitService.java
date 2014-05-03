package restful.gateway;

import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import org.hibernate.Session;
import org.hibernate.Transaction;

import db.mapping.object.Image;
import db.mapping.object.Portrait;
import db.mapping.object.User;
import db.mapping.object.DAO.ImageDAO;
import db.mapping.object.DAO.PortraitDAO;
import db.mapping.object.DAO.UserDAO;

@Path("portraitService")
public class PortraitService {	
	
	private User user;
	private Image image;
	private Portrait portrait;
	private UserDAO userDAO;
	private ImageDAO imageDAO;
	private PortraitDAO portraitDAO;
	
	private Session session;
	
	public PortraitService(){
		
		user = new User();
		image = new Image();
		portrait = new Portrait();
		
		userDAO = new UserDAO();
		imageDAO = new ImageDAO();
		portraitDAO = new PortraitDAO();
		
	}
	
	public List findPortrait(Integer userId, Integer imageId, Boolean isDefault){
		
		List portraits;
		this.user = this.userDAO.findById(userId);
		this.image = this.imageDAO.findById(imageId);
		
		if(user == null || image == null){
			return null; 
		}
		
		if(isDefault != null){
			String property[] = {PortraitDAO.USER_ID, PortraitDAO.IMAGE_ID, PortraitDAO.DEFAULT_IMAGE};
			Object value[] = {this.user,this.image,isDefault};
			portraits = this.portraitDAO.findByProperties(property, value, PortraitDAO.TABLE);		
		}
		else{
			String property[] = {PortraitDAO.USER_ID, PortraitDAO.IMAGE_ID};
			Object value[] = {this.user,this.image};
			portraits = this.portraitDAO.findByProperties(property, value, PortraitDAO.TABLE);
		}	
		
		return portraits;
	}
	
	public List findAllPortrait(Integer userId, Boolean isDefault){
		
		List portraits;
		this.user = this.userDAO.findById(userId);
		
		if(user == null){
			return null; 
		}
		
		if(isDefault != null){
			String property[] = {PortraitDAO.USER_ID,PortraitDAO.DEFAULT_IMAGE};
			Object value[] = {this.user,isDefault};
			portraits = this.portraitDAO.findByProperties(property, value, PortraitDAO.TABLE);		
		}
		else{
			String property[] = {PortraitDAO.USER_ID};
			Object value[] = {this.user};
			portraits = this.portraitDAO.findByProperties(property, value, PortraitDAO.TABLE);
		}	
		
		return portraits;
	}
	
	public void removeDuplicatePortrait(Integer userId, Integer imageId){
		Session session = this.portraitDAO.getSession();
		Transaction tx = session.beginTransaction();	
		
		try{
			List portraits = this.findPortrait(userId, imageId, null);
			if (portraits.size()>1){
				for(int i=1;i<portraits.size();i++){
					if( portraits.get(i) instanceof Portrait){
						session.delete((Portrait)portraits.get(i));
					}
				}
			}
			tx.commit();
//			session.close();
			this.portraitDAO.closeSession();
		}catch (Exception e){
			e.printStackTrace();
//			session.close();
			this.portraitDAO.closeSession();
		}	
	}
	
	public void unsetAllPortrait(Integer userId){
		
		Session session = this.portraitDAO.getSession();
		Transaction tx = session.beginTransaction();	
		
		try{
			List portraits = this.findAllPortrait(userId, true);
			if (portraits.size()>0){
				for(int i=0;i<portraits.size();i++){
					if( portraits.get(i) instanceof Portrait){
						this.portrait = (Portrait)portraits.get(i);
						this.portrait.setDefaultImage(false);
						session.update(this.portrait);
					}
				}
			}
			tx.commit();
//			session.close();
			this.portraitDAO.closeSession();
		}catch (Exception e){
			e.printStackTrace();
//			session.close();
			this.portraitDAO.closeSession();
		}	
	}
	
	@POST
	@Path("v1/portrait/add")
	@Produces("application/json")
	public Object addPortrait(@FormParam("userId") Integer userId,@FormParam("imageId") Integer imageId){
		
		boolean setDefault = false;
		
		//if no default portraits, set one.
		List portraits = this.findAllPortrait(userId,true);
		if(portraits.size()==0){
			setDefault = true;
		}
		
		
		Session session = this.portraitDAO.getSession();
		try{
			portraits = findPortrait(userId,imageId,null);
			if (portraits.size()==0){
				this.portrait.setUser(this.user);
				this.portrait.setImage(this.image);
				this.portrait.setDefaultImage(setDefault);
				Transaction tx = session.beginTransaction();			
				session.save(this.portrait);	
				tx.commit();
//				session.close();
				this.portraitDAO.closeSession();
				return RestUtil.string2json("true");
			}
		}catch (Exception e){
			e.printStackTrace();
//			session.close();
			this.portraitDAO.closeSession();
		}		
		return RestUtil.string2json("false"); 		
	}
	
		
	
	@PUT
	@Path("v1/portrait/refine")
	@Produces("application/json")
	public void refinePortrait(@FormParam("userId") Integer userId,@FormParam("imageId") Integer imageId){
		this.removeDuplicatePortrait(userId, imageId);
		this.unsetAllPortrait(userId);	
	}
	
	@GET
	@Path("v1/portrait/{userId}/all")
	@Produces("application/json")
	public Portrait[] getAllPortrait(@PathParam("userId") Integer userId){
		Portrait[] portrait = null;
		List portraits = this.findAllPortrait(userId, null);
		if (portraits.size()>0){
			
			portrait = new Portrait[portraits.size()];
			for (int i=0; i<portraits.size();i++){
				portrait[i] = (Portrait) portraits.get(i);
			}
		}
		return portrait;
	}
	
	@GET
	@Path("v1/portrait/{userId}/default")
	@Produces("application/json")
	public Portrait getDefaultPortrait(@PathParam("userId") Integer userId){
		List portraits = this.findAllPortrait(userId, true);
		if(portraits.size()==0){
			portraits = this.findAllPortrait(userId, null);
			if(portraits.size()>0){
				this.portrait = (Portrait)portraits.get(0);
				return this.portrait;
			}
			else{
				return null;
			}
		}else{
			this.portrait = (Portrait)portraits.get(0);
			return this.portrait;
		}
	}
	
		
	@POST
	@Path("v1/portrait/set")
	@Produces("application/json;charset=utf-8")
	public Object setDefaultPortrait(@FormParam("userId") Integer userId,
			@FormParam("imageId") Integer imageId,
			@HeaderParam("token") String token){
		this.refinePortrait(userId, imageId);	
		Session session = this.portraitDAO.getSession();
		try{
			User user = this.userDAO.findById(userId);
			if (!user.getToken().equals(token)){
				return RestUtil.string2json("false");
			}
				
			Transaction tx = session.beginTransaction();			
			user.setDefaultPortrait(this.image.getImageUrl());
			this.portrait.setUser(user);
			this.portrait.setImage(image);
			this.portrait.setDefaultImage(true);
			session.update(user);
			session.saveOrUpdate(this.portrait);	
			
			tx.commit();
//			session.close();
			this.portraitDAO.closeSession();
			return RestUtil.string2json("true");
			
		}catch (Exception e){
			e.printStackTrace();
//			session.close();
			this.portraitDAO.closeSession();
		}
		return RestUtil.string2json("false"); 		
	}
	
	@DELETE
	@Path("v1/portrait/{userId}/{imageId}/remove")
	@Produces("application/json")
	public Object removePortrait(@PathParam("userId") Integer userId,@PathParam("imageId") Integer imageId){
		Session session = this.portraitDAO.getSession();
		try{
			List portraits = findPortrait(userId,imageId,null);
			if (portraits.size()> 0){
				Transaction tx = session.beginTransaction();
				for (Object portrait: portraits){
					if( portrait instanceof Portrait){
						session.delete((Portrait) portrait);
					}
				}
				tx.commit();				
//				session.close();
				this.portraitDAO.closeSession();
				return RestUtil.string2json("true");
			}
		}catch (Exception e){
			e.printStackTrace();
//			session.close();	
			this.portraitDAO.closeSession();
		}		
		return RestUtil.string2json("false"); 		
	}

}