defmodule PlanIt.Trip do
  use Ecto.Schema

  import Ecto.Changeset

  @primary_key {:id, :id, autogenerate: true}
  schema "trip" do
    belongs_to :user, PlanIt.User

    field :name, :string

    has_many :card, PlanIt.Card
    has_many :favorite_trip, PlanIt.Trip

    timestamps()
  end

  def changeset(trip, params) do
    trip |> cast(params, [:name, :user_id])
  end
end
