import React, { useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
  isLoader: boolean;
  onDelete: (id: number) => void;
  todoChanger?: (todo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoader,
  onDelete,
  todoChanger = () => {},
}) => {
  const { completed, title } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(title);

  const field = useRef<HTMLInputElement>(null);

  const handleCompleteClick = () => {
    todoChanger({
      title: todo.title,
      id: todo.id,
      userId: todo.userId,
      completed: !todo.completed,
    });
  };

  const handleTitleDblClick = () => {
    setIsEditing(true);

    setTimeout(() => field.current?.focus(), 0);
  };

  const handleSubmitTitle = async () => {
    const clearTitle = editingTitle.trim();

    if (title === editingTitle) {
      setIsEditing(false);

      return;
    }

    if (!clearTitle) {
      return onDelete(todo.id);
    }

    try {
      await todoChanger({
        title: clearTitle,
        id: todo.id,
        userId: todo.userId,
        completed: todo.completed,
      });

      if (editingTitle !== '') {
        setIsEditing(false);
      }
    } catch {
      // should stay open
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmitTitle();
    }

    if (event.key === 'Escape') {
      setEditingTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={handleCompleteClick}
        />
      </label>

      {isEditing ? (
        <input
          ref={field}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editingTitle}
          onChange={event => setEditingTitle(event.target.value)}
          onBlur={handleSubmitTitle}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleTitleDblClick}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <Loader isLoader={isLoader} />
    </div>
  );
};
