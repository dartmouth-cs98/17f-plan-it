defmodule PlanIt.Trip do
  use Ecto.Schema

  import Ecto.Changeset

  @primary_key {:id, :id, autogenerate: true}
  schema "trip" do
    belongs_to :user, PlanIt.User

    field :name, :string
    field :publish, :boolean
    field :photo_url, :string
    field :start_date, :utc_datetime
    field :end_date, :utc_datetime

    has_many :card, PlanIt.Card
    has_many :favorited_trip, PlanIt.Trip

    timestamps()
  end

  def changeset(trip, params) do
    trip |> cast(params, [:name, :publish, :photo_url, :start_date, :end_date, :user_id])
  end
end
