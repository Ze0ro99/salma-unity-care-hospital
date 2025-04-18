import React, { useContext } from 'react';
import styled from 'styled-components';
import { useFetch } from '../hooks/useFetch';
import { AuthContext } from '../context/AuthContext';

const Container = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
`;

const LoadingMessage = styled.p`
  color: #007bff;
`;

const ErrorMessage = styled.p`
  color: #dc3545;
`;

const StepList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const StepItem = styled.li`
  background: #e7f3fe;
  border-left: 4px solid #2196f3;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
`;

interface Step {
  description: string;
}

interface CarePlanData {
  nextSteps: Step[];
}

const CarePlanPage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { data, loading, error } = useFetch<CarePlanData>(`/api/care-orchestration/orchestrate?patientId=${user.id}`);

  return (
    <Container>
      <Title>Your Care Plan</Title>
      {loading && <LoadingMessage>Loading your care plan...</LoadingMessage>}
      {error && <ErrorMessage>Failed to load care plan: {error.message}</ErrorMessage>}
      {!loading && !error && data?.nextSteps?.length === 0 && <p>No next steps available.</p>}
      {!loading && !error && data?.nextSteps?.length > 0 && (
        <StepList>
          {data.nextSteps.map((step, idx) => (
            <StepItem key={idx}>{step.description}</StepItem>
          ))}
        </StepList>
      )}
    </Container>
  );
};

export default CarePlanPage;
