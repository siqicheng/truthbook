package db.mapping.object.DAO;

import db.mapping.baseDAO.BaseHibernateDAO;
import db.mapping.object.ImageComment;

import java.util.List;
import org.hibernate.LockMode;
import org.hibernate.Query;
import org.hibernate.criterion.Example;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * A data access object (DAO) providing persistence and search support for
 * ImageComment entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see db.mapping.object.ImageComment
 * @author MyEclipse Persistence Tools
 */

public class ImageCommentDAO extends BaseHibernateDAO {
	private static final Logger log = LoggerFactory
			.getLogger(ImageCommentDAO.class);

	// Table Name
	
	public static final String TABLE = "ImageComment";
	
	// DB Mapping info
	
	public static final String ID = "id";
	public static final String IMAGE = "image";
	public static final String COMMENT = "comment";
	// property constants

	public void save(ImageComment transientInstance) {
		log.debug("saving ImageComment instance");
		try {
			getSession().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(ImageComment persistentInstance) {
		log.debug("deleting ImageComment instance");
		try {
			getSession().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public ImageComment findById(java.lang.Integer id) {
		log.debug("getting ImageComment instance with id: " + id);
		try {
			ImageComment instance = (ImageComment) getSession().get(
					"db.mapping.object.ImageComment", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(ImageComment instance) {
		log.debug("finding ImageComment instance by example");
		try {
			List results = getSession().createCriteria(
					"db.mapping.object.ImageComment").add(
					Example.create(instance)).list();
			log.debug("find by example successful, result size: "
					+ results.size());
			return results;
		} catch (RuntimeException re) {
			log.error("find by example failed", re);
			throw re;
		}
	}

	public List findByProperty(String propertyName, Object value) {
		log.debug("finding ImageComment instance with property: "
				+ propertyName + ", value: " + value);
		try {
			String queryString = "from ImageComment as model where model."
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

	public List findAll() {
		log.debug("finding all ImageComment instances");
		try {
			String queryString = "from ImageComment";
			Query queryObject = getSession().createQuery(queryString);
			queryObject.setCacheable(false);
			return queryObject.list();
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public ImageComment merge(ImageComment detachedInstance) {
		log.debug("merging ImageComment instance");
		try {
			ImageComment result = (ImageComment) getSession().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(ImageComment instance) {
		log.debug("attaching dirty ImageComment instance");
		try {
			getSession().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(ImageComment instance) {
		log.debug("attaching clean ImageComment instance");
		try {
			getSession().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}
}