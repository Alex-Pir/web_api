using System.Data;
using System.Data.SqlClient;
using TodoBack.Domain;

namespace TodoBack.Repositories
{
    public class DBTodoRepository : ITodoRepository
    {
        protected readonly string _connectionString;

        protected readonly string _tableName = "todo";

        public DBTodoRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public int Create(Todo todo)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = connection.CreateCommand())
                {
                    command.CommandText =
                        $@"insert into [{_tableName}]
                            ([title], [is_done])
                        values
                            (@title, @isDone)
                        select SCOPE_IDENTITY()";

                    command.Parameters.Add("@title", SqlDbType.NVarChar).Value = todo.Title;
                    command.Parameters.Add("@isDone", SqlDbType.Bit).Value = todo.IsDone;

                    return Convert.ToInt32(command.ExecuteScalar());
                }
            }
        }

        public void Delete(Todo todo)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = connection.CreateCommand())
                {
                    command.CommandText =
                        $@"delete from [{_tableName}]
                            where [id] = @id";

                    command.Parameters.Add("@id", SqlDbType.Int).Value = todo.Id;
                    command.ExecuteScalar();
                }
            }
        }

        public Todo? Get(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = connection.CreateCommand())
                {
                    command.CommandText =
                        $@"select *
                        from {_tableName}
                        where [id] = @id";

                    command.Parameters.Add("@id", SqlDbType.Int).Value = id;

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new Todo
                            {
                                Id = Convert.ToInt32(reader["id"]),
                                Title = Convert.ToString(reader["title"]),
                                IsDone = Convert.ToBoolean(reader["is_done"])
                            };
                        }
                    }
                }
            }

            return null;
        }

        public List<Todo> GetTodos()
        {
            var result = new List<Todo>();

            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = connection.CreateCommand())
                {
                    command.CommandText =
                        $@"select *
                        from [{_tableName}]";

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(new Todo
                            {
                                Id = Convert.ToInt32(reader["id"]),
                                Title = Convert.ToString(reader["title"]),
                                IsDone = Convert.ToBoolean(reader["is_done"])
                            });
                        }
                    }
                }
            }

            return result;
        }

        public int Update(Todo todo)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = connection.CreateCommand())
                {
                    command.CommandText =
                        $@"update [{_tableName}]
                            set [title] = @title, [is_done] = @isDone
                        where [id] = @id";

                    command.Parameters.Add("@id", SqlDbType.Int).Value = todo.Id;
                    command.Parameters.Add("@title", SqlDbType.NVarChar).Value = todo.Title;
                    command.Parameters.Add("@isDone", SqlDbType.Bit).Value = todo.IsDone;

                    return Convert.ToInt32(command.ExecuteScalar());
                }
            }
        }
    }
}
