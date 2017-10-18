defmodule PlanIt.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:user) do
      add :fname, :string
      add :lname, :string
      add :email, :string
      add :username, :string
      add :birthday, :integer

      timestamps
    end

    create unique_index(:user, [:email, :username])
  end
end
