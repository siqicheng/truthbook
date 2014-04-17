package test;

import java.util.List;

import org.hibernate.LockMode;
import org.hibernate.Query;
import org.hibernate.criterion.Example;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import db.mapping.baseDAO.BaseHibernateDAO;

/**
 * A data access object (DAO) providing persistence and search support for
 * ReadMessage entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see test.ReadMessage
 * @author MyEclipse Persistence Tools
 */

public class ReadMessageDAO extends BaseHibernateDAO {
	private static final Logger log = LoggerFactory
			.getLogger(ReadMessageDAO.class);
	// property constants
	public static final String MESSAGE_TYPE = "messageType";
	public static final String USER_ID = "userId";
	public static final String SOURCE_ID = "sourceId";

	public void save(ReadMessage transientInstance) {
		log.debug("saving ReadMessage instance");
		try {
			getSession().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(ReadMessage persistentInstance) {
		log.debug("deleting ReadMessage instance");
		try {
			getSession().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public ReadMessage findById(java.lang.Integer id) {
		log.debug("getting ReadMessage instance with id: " + id);
		try {
			ReadMessage instance = (ReadMessage) getSession().get(
					"db.mapping.object.ReadMessage", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(ReadMessage instance) {
		log.debug("finding ReadMessage instance by example");
		try {
			List results = getSession()
					.createCriteria("db.mapping.object.ReadMessage")
					.add(Example.create(instance)).list();
			log.debug("find by example successful, result size: "
					+ results.size());
			return results;
		} catch (RuntimeException re) {
			log.error("find by example failed", re);
			throw re;
		}
	}

	public List findByProperty(String propertyName, Object value) {
		log.debug("finding ReadMessage instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from ReadMessage as model where model."
					+ propertyName + "= ?";
			Query queryObject = getSession().createQuery(queryString);
			queryObject.setParameter(0, value);
			return queryObject.list();
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List findByMessageType(Object messageType) {
		return findByProperty(MESSAGE_TYPE, messageType);
	}

	public List findByUserId(Object userId) {
		return findByProperty(USER_ID, userId);
	}

	public List findBySourceId(Object sourceId) {
		return findByProperty(SOURCE_ID, sourceId);
	}

	public List findAll() {
		log.debug("finding all ReadMessage instances");
		try {
			String queryString = "from ReadMessage";
			Query queryObject = getSession().createQuery(queryString);
			return queryObject.list();
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public ReadMessage merge(ReadMessage detachedInstance) {
		log.debug("merging ReadMessage instance");
		try {
			ReadMessage result = (ReadMessage) getSession().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(ReadMessage instance) {
		log.debug("attaching dirty ReadMessage instance");
		try {
			getSession().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(ReadMessage instance) {
		log.debug("attaching clean ReadMessage instance");
		try {
			getSession().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}
}