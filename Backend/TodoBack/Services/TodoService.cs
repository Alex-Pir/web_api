using TodoBack.Domain;
using TodoBack.Dto;
using TodoBack.Repositories;

namespace TodoBack.Services
{
    public class TodoService : ITodoService
    {
        private const string CONNECTION_SETTING_NAME = "TodoConnection";

        private ITodoRepository repository;

        public TodoService(IConfiguration configuration)
        {
            repository = new DBTodoRepository(
                configuration.GetConnectionString(CONNECTION_SETTING_NAME)
           );
        }

        public int CompleteTodo(int todoId)
        {
            Todo todo = GetTodo(todoId);

            todo.IsDone = true;

            return repository.Update(todo);
        }

        public int CreateTodo(TodoDto todo)
        {
            if (todo == null || todo.Title.Trim().Length == 0)
            {
                throw new Exception("Todo title can not is empty");
            }

            return repository.Create(
                new Todo()
                {
                    Id = 0,
                    Title = todo.Title,
                    IsDone = false
                }
            );
        }

        public void DeleteTodo(int todoId)
        {
            Todo todo = GetTodo(todoId);

            repository.Delete(todo);
        }

        public Todo GetTodo(int todoId)
        {
            if (todoId <= 0)
            {
                throw new ArgumentException("Id can not be a negative number");
            }

            Todo? todo = repository.Get(todoId);

            if (todo == null)
            {
                throw new Exception("Can not find task by id");
            }

            return todo;
        }

        public List<Todo> GetTodos()
        {
            return repository.GetTodos();
        }
    }
}
