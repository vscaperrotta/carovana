/*
 *
 * Home Route
 *
 */

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MapPinned, MessageSquareHeart, Plus } from 'lucide-react';
import AppHeader from '@components/Layout';
import Button from '@components/Button';
import Modal from '@components/Modal';
import DateRangePicker from '@components/DatePicker';
import {
  subscribeTrips,
  createTripRequest,
  clearCreatedTrip,
} from '@store/actions/trips';
import {
  selectTrips,
  selectTripsLoading,
  selectCreatedTripId,
} from '@store/selectors';
import { t } from '@utils/i18n';
import TripCard from './TripCard';
import './Home.scss';

const Home = () => {
  const dispatch = useDispatch();
  const trips = useSelector(selectTrips);
  const loading = useSelector(selectTripsLoading);
  const [modalOpen, setModalOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    dispatch(subscribeTrips());
  }, [dispatch]);

  // Nearest-first: dated trips ordered chronologically, undated trips pushed to the end.
  const sortedTrips = [...trips].sort((a, b) => {
    if (!a.startDate && !b.startDate) return 0;
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return a.startDate.localeCompare(b.startDate);
  });

  return (
    <>
      <AppHeader />
      <main className="container home">
        <div className="home__intro">
          <h1 className="font-display">{t('home.title')}</h1>
          <p>{t('home.subtitle')}</p>
        </div>

        <div className="home__toolbar">
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <Plus size={18} strokeWidth={2.5} aria-hidden="true" />
            {t('home.newTrip')}
          </Button>
        </div>

        <button type="button" className="home__feedback-cta" onClick={() => setFeedbackOpen(true)}>
          <MessageSquareHeart size={16} strokeWidth={2} aria-hidden="true" />
          {t('home.feedbackCta')}
        </button>

        {!loading && trips.length === 0 && (
          <div className="home__empty">
            <MapPinned size={32} strokeWidth={1.5} aria-hidden="true" />
            <p>{t('home.empty')}</p>
          </div>
        )}

        <ul className="home__list">
          {sortedTrips.map((trip) => (
            <li key={trip.id}>
              <TripCard trip={trip} />
            </li>
          ))}
        </ul>
      </main>

      <NewTripModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
};

const FEEDBACK_ENDPOINT = 'https://formsubmit.co/ajax/nofantasystudio@gmail.com';

const FeedbackModal = ({ open, onClose }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  function handleClose() {
    onClose();
    // Reset after the close animation would run, not mid-modal.
    setTimeout(() => {
      setMessage('');
      setError(null);
      setSent(false);
    }, 200);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setError(null);
    try {
      const response = await fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'Feedback Carovana',
          message: trimmed,
          page: window.location.href,
        }),
      });
      if (!response.ok) throw new Error();
      setSent(true);
    } catch {
      setError(t('home.feedbackError'));
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('home.feedbackTitle')}>
      {sent ? (
        <p className="feedback-form__success">{t('home.feedbackSuccess')}</p>
      ) : (
        <form className="feedback-form" onSubmit={handleSubmit}>
          <label>
            {t('home.feedbackLabel')}
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={t('home.feedbackPlaceholder')}
              maxLength={2000}
              rows={5}
              autoFocus
            />
          </label>

          {error && <p className="feedback-form__error">{error}</p>}

          <Button type="submit" variant="primary" disabled={!message.trim() || sending}>
            {sending ? t('home.feedbackSubmitting') : t('home.feedbackSubmit')}
          </Button>
        </form>
      )}
    </Modal>
  );
};

FeedbackModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

const NewTripModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const createdId = useSelector(selectCreatedTripId);
  const creating = useSelector((state) => state.trips.creating);
  const error = useSelector((state) => state.trips.error);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (!createdId) return;
    setName('');
    setStartDate('');
    setEndDate('');
    onClose();
    navigate(`/viaggio/${createdId}`);
    dispatch(clearCreatedTrip());
  }, [createdId, dispatch, navigate, onClose]);

  function handleClose() {
    dispatch(clearCreatedTrip());
    onClose();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || creating) return;
    dispatch(createTripRequest({ name: trimmed, startDate, endDate }));
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('home.newTrip')}>
      <form className="new-trip-form" onSubmit={handleSubmit}>
        <label>
          {t('home.nameLabel')}
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t('home.namePlaceholder')}
            maxLength={60}
            autoFocus
          />
        </label>
        <DateRangePicker
          startLabel={t('home.dateFrom')}
          endLabel={t('home.dateTo')}
          start={startDate}
          end={endDate}
          onChangeStart={setStartDate}
          onChangeEnd={setEndDate}
        />

        {error && <p className="new-trip-form__error">{error}</p>}

        <Button type="submit" variant="primary" disabled={!name.trim() || creating}>
          {creating ? t('home.creating') : t('home.create')}
        </Button>
      </form>
    </Modal>
  );
};

NewTripModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default Home;
