import useOnErrorMutationAlert from '../hooks/useOnErrorMutationAlert';
import { UserContext } from '../contexts/UserContext';
import { graphql } from 'react-relay';
import { useCallback, useContext } from 'react';
import { useMutation } from 'relay-hooks';
import { useCreateTagMutationVariables as Variables } from './__generated__/useCreateTagMutation.graphql';

const mutation = graphql`
  mutation useCreateTagMutation($input: CreateTagInput!) {
    createTag(input: $input) {
      edge {
        node {
          id
        }
      }
    }
  }
`;

function useMutationRequisites() {
  const { user } = useContext(UserContext);
  const { id } = user as any;
  const configs: any = [{
    connectionInfo: [{
      key: 'useViewerTagsPagination_tags',
      rangeBehavior: 'append'
    }],
    edgeName: 'edge',
    parentID: id,
    type: 'RANGE_ADD',
  }];

  return { configs }
}

function useCreateNoteMutation() {
  const { configs } = useMutationRequisites();
  const onError = useOnErrorMutationAlert();
  const [mutate] = useMutation(mutation, { configs, onError });
  const onCreateOption = useCallback((variables: Variables) => {
    mutate({ variables });
  }, [mutate]);

  return onCreateOption;
}

export default useCreateNoteMutation;
