defmodule PlanIt.Trip do
  use Ecto.Schema

  @primary_key {:id, :id, autogenerate: true}
  schema "trip" do
    belongs_to :user, PlanIt.User

    field :name, :string

    has_many :card, PlanIt.Card

    timestamps()
  end
end
