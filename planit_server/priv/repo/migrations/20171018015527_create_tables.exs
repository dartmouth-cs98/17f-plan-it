defmodule PlanIt.Repo.Migrations.CreateTables do
  use Ecto.Migration

  def change do

    create table(:user) do
      add :fname, :string
      add :lname, :string
      add :email, :string
      add :username, :string
      add :birthday, :date

      timestamps()
    end

    create unique_index(:user, [:email])
    create unique_index(:user, [:username])

    create table(:trip) do
      add :name, :string
      add :user_id, references(:user)

      timestamps()
    end

    create table(:card) do
      add :type, :string
      add :name, :string
      add :city, :string
      add :country, :string
      add :address, :string
      add :lat, :float
      add :long, :float
      add :start_time, :utc_datetime
      add :end_time, :utc_datetime
      add :day_number, :integer

      add :travel_type, :string
      add :travel_duration, :time

      add :trip_id, references(:trip)

      timestamps()
    end

    create table(:favorited_trip) do
      add :user_id, references(:user)
      add :trip_id, references(:trip)

      timestamps()
    end
  end
end
