defmodule PlanIt.Trip do
  use Ecto.Schema

  @primary_key {:id, :id, autogenerate: true}
  schema "trip" do
    field :name, :string
    field :intensity, :integer
    field :visibility, :boolean
    field :upvotes, :integer

    belongs_to :user, PlanIt.User
    belongs_to :card, PlanIt.Card
    has_many :day, PlanIt.Day
    timestamps()
  end
end
