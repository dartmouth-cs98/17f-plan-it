defmodule PlanIt.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :fname, :string
      add :lname, :string
      add :email, :string
      add :username, :string
      add :birthday, :datetime

      timestamps
    end

    create unique_index(:users, [:email, :username])
  end
end
