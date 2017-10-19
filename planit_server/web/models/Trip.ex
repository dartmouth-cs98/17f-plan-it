defmodule PlanIt.Trip do
  use Ecto.Schema

  @primary_key {:trip_id, :id, autogenerate: true}
  schema "trip" do
    belongs_to :user, PlanIt.User
    has_many :day, PlanIt.Day
    has_many :card, PlanIt.Card

    field :name, :string
    field :intensity, :integer
    field :visibility, :boolean
    field :upvotes, :integer


    timestamps()
  end
end
