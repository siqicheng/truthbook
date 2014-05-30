package restful.gateway;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

import db.mapping.object.Image;
import db.mapping.object.Relationship;
import db.mapping.object.User;
import db.mapping.object.UserFetch;
import db.mapping.object.DAO.ImageDAO;
import db.mapping.object.DAO.RelationshipDAO;
import db.mapping.object.DAO.UserDAO;
import db.mapping.object.DAO.UserFetchDAO;

@Path("feedService")
public class FeedService {
		private UserFetchDAO userFetchDAO;
		private UserDAO userDAO;
		private RelationshipDAO relationshipDAO;
		private ImageDAO imageDAO;
		
		public FeedService(){
			this.userDAO = new UserDAO();
			this.userFetchDAO = new UserFetchDAO();
			this.relationshipDAO = new RelationshipDAO();
			this.imageDAO = new ImageDAO();
		}
		
		private int returnSmaller(int one, int two){
			if(one>two)return two;
			else return one;
		}
		
		@GET
		@Path("v1/feed/{userId}")
		@Produces("application/json;charset=utf-8")
		public Image[] getFeed(@PathParam("userId") Integer userId,
				@HeaderParam("token") String token){

			try{
				Session session = this.userFetchDAO.getSession();
				Transaction tx = session.beginTransaction();
				UserFetch userFetch = this.userFetchDAO.findById(userId) ;
				User user = this.userDAO.findById(userId);
				if (!user.getToken().equals(token)){
					this.userFetchDAO.closeSession();
					return null;
				}
				List<Image> image_list =new ArrayList();
				List<Relationship> relat_list = this.relationshipDAO.findByUser(user);
				for (Relationship relat : relat_list){
					User friend = this.userDAO.findById(relat.getFriendId());
					Criteria criteria = session.createCriteria(Image.class);
					criteria.add(Restrictions.gt(ImageDAO.LAST_MODIFIED, userFetch.getLastFetchTime()))
					.add(Restrictions.eq(ImageDAO.USER, friend))
					.add(Restrictions.eq(ImageDAO.APPROVED,true))
					.add(Restrictions.eq(ImageDAO.DELETED, false))
					.addOrder(Order.desc("lastModified"));
					List<Image> friend_image = criteria.list();
					image_list.addAll(friend_image);
				}
				Image[] images = new Image[image_list.size()];
				for (int i=0 ;i < image_list.size(); ++i){
					images[i] = image_list.get(i);
				}
				userFetch.setLastFetchTime(new Timestamp(System.currentTimeMillis()));
				session.update(userFetch);
				tx.commit();
				this.userFetchDAO.closeSession();
				return images;
			} catch (Exception e){
				e.printStackTrace();
				this.userFetchDAO.closeSession();
				return null;
			}
		}
		
		@GET
		@Path("v1/feed/{userId}/all")
		@Produces("application/json;charset=utf-8")
		public Image[] getAllFeed(@PathParam("userId") Integer userId,
				@HeaderParam("token") String token){
			
			try{
				Session session = this.userFetchDAO.getSession();
				UserFetch userFetch = this.userFetchDAO.findById(userId) ;
				User user = this.userDAO.findById(userId);
				if (!user.getToken().equals(token)){
					this.userFetchDAO.closeSession();
					return null;
				}
				List<Image> image_list =new ArrayList();
				List<Relationship> relat_list = this.relationshipDAO.findByUser(user);
				for (Relationship relat : relat_list){
					User friend = this.userDAO.findById(relat.getFriendId());
					Criteria criteria = session.createCriteria(Image.class);
					criteria.addOrder(Order.desc("lastModified"))
					.add(Restrictions.eq(ImageDAO.USER, friend))
					.add(Restrictions.eq(ImageDAO.APPROVED,true))
					.add(Restrictions.eq(ImageDAO.DELETED, false));
					
					List<Image> friend_image = criteria.list();;
					image_list.addAll(friend_image);
				}
//				int imageSize = 200;
				int imageSize = image_list.size();
				int forNumber = returnSmaller(imageSize, image_list.size());
				Image[] images = new Image[forNumber];
				for (int i=0 ;i < images.length; ++i){
					images[i] = image_list.get(i);
				}
				Transaction tx = session.beginTransaction();
				userFetch.setLastFetchTime(new Timestamp(System.currentTimeMillis()));
				session.update(userFetch);
				tx.commit();
				this.userFetchDAO.closeSession();
				return images;
			} catch (Exception e){
				e.printStackTrace();
				this.userFetchDAO.closeSession();
				return null;
			}
		}
}
