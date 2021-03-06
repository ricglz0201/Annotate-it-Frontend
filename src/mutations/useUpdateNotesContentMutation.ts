import useOnErrorMutationAlert from '../hooks/useOnErrorMutationAlert';
import useTextField from '../hooks/useTextField';
import { ChangeEvent, useCallback } from 'react';
import { graphql } from 'react-relay';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from 'relay-hooks';

const mutation = graphql`
  mutation useUpdateNotesContentMutation(
    $input: UpdateNoteContentInput!
  ) {
    updateNoteContent(input: $input) {
      updatedNote {
        id
        content
      }
    }
  }
`

interface MutationObject {
  loading: boolean;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  text: string;
}

type callback = [() => void, MutationObject]

function useMutationRequisites(content: string) {
  const [text, onChange] = useTextField(content);
  const history = useHistory();
  const { noteId, folderId } = useParams();

  const onCompleted = useCallback(() => {
    history.push(`/folder/${folderId}/notes/${noteId}`);
  }, [folderId, history, noteId]);
  const optimisticResponse = {
    updateNoteContent: {
      updatedNote: {
        id: noteId,
        content: text,
      }
    }
  };

  return { text, onChange, noteId, onCompleted, optimisticResponse };
}

function useUpdateNotesContentMutation(content: string): callback {
  const {
    noteId, onChange, onCompleted, optimisticResponse, text
  } = useMutationRequisites(content);
  const onError = useOnErrorMutationAlert();

  const [mutate, { loading }] = useMutation(
    mutation, { onCompleted, onError, optimisticResponse }
  );

  const onClick = useCallback(() => {
    mutate({ variables: { input: { content: text, noteId } } })
  }, [text, mutate, noteId])
  return [onClick, { loading, onChange, text }];
}

export default useUpdateNotesContentMutation;
