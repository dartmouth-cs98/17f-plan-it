defmodule PlanIt.Repo.Migrations.CreateTables do
  use Ecto.Migration

  def change do

    create table(:travel) do

      timestamps()
    end

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
      add :start_time, :utc_datetime
      add :end_time, :utc_datetime
      add :day_number, :integer

      add :travel_id, references(:travel)
      add :trip_id, references(:trip)

      timestamps()
    end

    alter table(:travel) do
      add :type, :string
      add :duration, :time

      add :card_id, references(:card)
    end

  end
end
