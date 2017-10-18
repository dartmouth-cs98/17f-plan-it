defmodule PlanIt.Repo.Migrations.CreateTables do
  use Ecto.Migration

  def change do
    create table(:card) do
      add :type, :string
      add :name, :string
      add :city, :string
      add :country, :string
      add :address, :string
      add :start_time, :utc_datetime
      add :end_time, :utc_datetime

      timestamps()
    end

    create table(:trip) do
      add :name, :string
      add :user_id, references(:user)
      add :first_card_id, references(:card)
      add :last_card_id, references(:card)

      timestamps()
    end

    create table(:day) do
      add :day_number, :integer
      add :trip_id, references(:trip)
      add :first_card_id, references(:card)
      add :last_card_id, references(:card)

      timestamps()
    end

    create table(:travel) do
      add :type, :string
      add :duration, :time
      add :start_card_id, references(:card)
      add :end_card_id, references(:card)

      timestamps()
    end
  end
end
