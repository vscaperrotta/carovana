/*
 *
 * Home Route
 *
 */

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MapPinned, Plus } from 'lucide-react';
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
    </>
  );
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
