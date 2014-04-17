package test;

import db.mapping.baseDAO.BaseHibernateDAO;
import java.util.List;
import org.hibernate.LockMode;
import org.hibernate.Query;
import org.hibernate.criterion.Example;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * A data access object (DAO) providing persistence and search support for
 * Portrait entities. Transaction control of the save(), update() and delete()
 * operations can directly support Spring container-managed transactions or they
 * can be augmented to handle user-managed Spring transactions. Each of these
 * methods provides additional information for how to configure it for the
 * desired type of transaction control.
 * 
 * @see db.mapping.object.Portrait
 * @author MyEclipse Persistence Tools
 */

public class PortraitDAO extends BaseHibernateDAO {
	private static final Logger log = LoggerFactory
			.getLogger(PortraitDAO.class);
	// property constants
	public static final String DEFAULT_IMAGE = "defaultImage";

	public void save(Portrait transientInstance) {
		log.debug("saving Portrait instance");
		try {
			getSession().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(Portrait persistentInstance) {
		log.debug("deleting Portrait instance");
		try {
			getSession().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public Portrait findById(java.lang.Integer id) {
		log.debug("getting Portrait instance with id: " + id);
		try {
			Portrait instance = (Portrait) getSession().get(
					"db.mapping.object.Portrait", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(Portrait instance) {
		log.debug("finding Portrait instance by example");
		try {
			List results = getSession().createCriteria(
					"db.mapping.object.Portrait").add(Example.create(instance))
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
		log.debug("finding Portrait instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from Portrait as model where model."
					+ propertyName + "= ?";
			Query queryObject = getSession().createQuery(queryString);
			queryObject.setParameter(0, value);
			return queryObject.list();
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List findByDefaultImage(Object defaultImage) {
		return findByProperty(DEFAULT_IMAGE, defaultImage);
	}

	public List findAll() {
		log.debug("finding all Portrait instances");
		try {
			String queryString = "from Portrait";
			Query queryObject = getSession().createQuery(queryString);
			return queryObject.list();
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public Portrait merge(Portrait detachedInstance) {
		log.debug("merging Portrait instance");
		try {
			Portrait result = (Portrait) getSession().merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(Portrait instance) {
		log.debug("attaching dirty Portrait instance");
		try {
			getSession().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(Portrait instance) {
		log.debug("attaching clean Portrait instance");
		try {
			getSession().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}
}