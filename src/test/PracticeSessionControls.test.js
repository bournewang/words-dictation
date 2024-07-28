// import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PracticeSessionControls from '../components/PracticeSessionControls';
import * as utils from '../api/utils';

jest.mock('../api/utils', () => ({
  hasUnfinishedSession: jest.fn()
}));

describe('PracticeSessionControls', () => {
  it('should render start new session button', () => {
    const { getByText } = render(<PracticeSessionControls />);
    expect(getByText('Start New Practice')).toBeInTheDocument();
  });

  it('should render resume button when there is an unfinished session', () => {
    utils.hasUnfinishedSession.mockReturnValue(true);
    const { getByText } = render(<PracticeSessionControls />);
    expect(getByText('Resume Previous Practice')).toBeInTheDocument();
  });

  it('should not render resume button when there is no unfinished session', () => {
    utils.hasUnfinishedSession.mockReturnValue(false);
    const { queryByText } = render(<PracticeSessionControls />);
    expect(queryByText('Resume Previous Practice')).not.toBeInTheDocument();
  });

  it('should call onStartNewSession when start button is clicked', () => {
    const onStartNewSession = jest.fn();
    const { getByText } = render(<PracticeSessionControls onStartNewSession={onStartNewSession} />);
    fireEvent.click(getByText('Start New Practice'));
    expect(onStartNewSession).toHaveBeenCalled();
  });

  it('should call onResumePractice when resume button is clicked', () => {
    utils.hasUnfinishedSession.mockReturnValue(true);
    const onResumePractice = jest.fn();
    const { getByText } = render(<PracticeSessionControls onResumePractice={onResumePractice} />);
    fireEvent.click(getByText('Resume Previous Practice'));
    expect(onResumePractice).toHaveBeenCalled();
  });
});