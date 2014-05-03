package db.mapping.object.DAO;

import db.mapping.baseDAO.BaseHibernateDAO;
import db.mapping.object.Image;

import java.util.Date;
import java.util.List;
import java.util.Set;
import org.hibernate.LockMode;
import org.hibernate.Query;
import org.hibernate.criterion.Example;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * A data access object (DAO) providing persistence and search support for Image
 * entities. Transaction control of the save(), update() and delete() operations
 * can directly support Spring container-managed transactions or they can be
 * augmented to handle user-managed Spring transactions. Each of these methods
 * provides additional information for how to configure it for the desired type
 * of transaction control.
 * 
 * @see db.mapping.object.Image
 * @author MyEclipse Persistence Tools
 */

public class ImageDAO extends BaseHibernateDAO {
	private static final Logger log = LoggerFactory.getLogger(ImageDAO.class);
	// property constants
	public static final String IMAGE_ID = "imageId";
	public static final String IMAGE_URL = "imageUrl";
	public static final String CREATE_DATE = "createDate";
	public static final String LAST_MODIFIED = "lastModified";
	public static final String UPLOADER_ID = "uploaderId";
	public static final String APPROVED = "approved";
	public static final String DELETED = "deleted";
	public static final String USER = "user";
	public static final String CONTENT = "content";
	public static final String LIKED = "liked";
	public static final String TABLE = "Image";
	

	public void save(Image transientInstance) {
		log.debug("saving Image instance");
		try {
			getSession().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(Image persistentInstance) {
		log.debug("deleting Image instance");
		try {
			getSession().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public Image findById(java.lang.Integer id) {
		log.debug("getting Image instance with id: " + id);
		try {
			Image instance = (Image) getSession().get(
					"db.mapping.object.Image", id);
			this.closeSession();
			return instance;
		} catch (RuntimeException re) {
			this.closeSession();
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(Image instance) {
		log.debug("finding Image instance by example");
		try {
			List results = getSession().createCriteria(
					"db.mapping.object.Image").add(Example.create(instance))
					.list();
			log.debug("find by example successful, result size: "
					+ results.size());
			return results;
		} catch (RuntimeException re) {
			log.error("find by example failed", re);
			throw re;
		}
	}

	public List findByProperty(String propertyName, Object value) {
		log.debug("finding Image instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from Image as model where model."
					+ propertyName + "= ?";
			Query queryObject = getSession().createQuery(queryString);
			queryObject.setCacheable(false);
			queryObject.setParameter(0, value);
			return queryObject.list();
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}
	
	public List findByUser(Object user) {
		return findByProperty(USER, user);
	}

	
	public List findByImageUrl(Object imageUrl) {
		return findByProperty(IMAGE_URL, imageUrl);
	}

	public List findByUploaderId(Object uploaderId) {
		return findByProperty(UPLOADER_ID, uploaderId);
	}

	public List findByApproved(Object approved) {
		return findByProperty(APPROVED, approved);
	}

	public List findAll() {
		log.debug("finding all Image instances");
		try {
			String queryString = "from Image";
			Query queryObject = getSession().createQuery(queryString);
			queryObject.setCacheable(false);
			return queryObject.list();
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public Image merge(Image detachedInstance) {
		log.debug("merging Image instance");
		try {
			Image result = (Image) getSession().merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(Image instance) {
		log.debug("attaching dirty Image instance");
		try {
			getSession().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(Image instance) {
		log.debug("attaching clean Image instance");
		try {
			getSession().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}
}